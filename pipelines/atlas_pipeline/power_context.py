"""Gridded monthly rainfall, snow, drought (SPI-3) and heat context for Nepal (Features 54-55).

Source: NASA POWER v10 MERRA-2 monthly UTC Zarr store on the AWS Open Data registry (CC BY 4.0). Only the
four 30x30-cell chunks that cover Nepal are pinned by SHA-256 for each variable; nothing is interpolated.

Run ``python -m pipelines.atlas_pipeline.power_context --download`` once to fetch the pinned chunks into
``data/raw/power-zarr/`` (verified against the hashes below), then without arguments to publish.
"""

import argparse
import json
import math
from datetime import date, timedelta
from urllib.request import Request, urlopen

import numpy as np
from rasterio.warp import transform_geom
from shapely.geometry import box, mapping, shape

from .contracts import ROOT
from .live_contracts import require
from .model_release import (
    digest,
    encode,
    external_input,
    gzip_bytes,
    input_reference,
    publish,
    read_json_artifact,
    semantic,
)
from .population_hrsl import nepal_country

ID, VERSION = "nepal-power-gridded-context", "1.0.0"
RAW = ROOT / "data/raw/power-zarr"
STORE = "https://nasa-power.s3.amazonaws.com/merra2/temporal/power_merra2_monthly_temporal_utc.zarr/"
LICENSE_FILE_URL = "https://nasa-power.s3.amazonaws.com/LICENSE.txt"
REGISTRY_URL = "https://registry.opendata.aws/nasa-power/"
VARIABLES = {
    "PRECTOTCORR": {"unit": "mm/day", "label": "Bias-corrected precipitation rate (monthly mean)"},
    "PRECSNOLAND": {"unit": "mm/day", "label": "Snowfall over land, water equivalent (monthly mean)"},
    "SNODP": {"unit": "cm", "label": "Snow depth on land (monthly mean)"},
    "FRSNO": {"unit": "1", "label": "Land snow-cover fraction (monthly mean)"},
    "T2M_MAX": {"unit": "degC", "label": "Highest hourly 2 m air temperature in the month"},
}
CHUNKS = ["0.7.13", "0.7.14", "0.8.13", "0.8.14"]
COORDS = ["time/0", "lat/0", "lon/0"]
BASELINE = (1991, 2020)
RECENT_MONTHS = 12
SPI_CLASSES = [  # McKee, Doesken & Kleist (1993)
    {"id": "extremely-dry", "min": None, "max": -2.0, "label": "Extremely dry"},
    {"id": "severely-dry", "min": -2.0, "max": -1.5, "label": "Severely dry"},
    {"id": "moderately-dry", "min": -1.5, "max": -1.0, "label": "Moderately dry"},
    {"id": "near-normal", "min": -1.0, "max": 1.0, "label": "Near normal"},
    {"id": "moderately-wet", "min": 1.0, "max": 1.5, "label": "Moderately wet"},
    {"id": "severely-wet", "min": 1.5, "max": 2.0, "label": "Severely wet"},
    {"id": "extremely-wet", "min": 2.0, "max": None, "label": "Extremely wet"},
]
# Pinned with --download on 2026-10-07; keys are "<variable>/<chunk>".
SOURCES = ROOT / "pipelines/power-context-sources.json"
PINNED = json.loads(SOURCES.read_text()) if SOURCES.exists() else {}


def fetch(path):
    with urlopen(Request(STORE + path, headers={"User-Agent": "himalayan-disaster-atlas"}), timeout=120) as response:
        return response.read()


def download():
    RAW.mkdir(parents=True, exist_ok=True)
    pins = {}
    entries = [".zmetadata"] + COORDS + [f"{v}/{c}" for v in VARIABLES for c in CHUNKS]
    for entry in entries:
        raw = fetch(entry)
        target = RAW / entry
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        pins[entry] = {"sha256": digest(raw), "byte_size": len(raw)}
    with urlopen(LICENSE_FILE_URL, timeout=60) as response:
        licence = response.read()
    (RAW / "LICENSE.txt").write_bytes(licence)
    pins["LICENSE.txt"] = {"sha256": digest(licence), "byte_size": len(licence)}
    if PINNED:
        for key, pin in PINNED.items():
            require(pins.get(key) == pin, f"Upstream bytes changed for {key}; review before re-pinning")
    SOURCES.write_text(json.dumps(pins, indent=2, sort_keys=True) + "\n")
    return pins


def read_raw(entry):
    raw = (RAW / entry).read_bytes()
    pin = PINNED.get(entry)
    require(pin is not None and digest(raw) == pin["sha256"] and len(raw) == pin["byte_size"], f"Unpinned or changed POWER chunk {entry}")
    return raw


def decode(name, key, meta):
    import numcodecs  # build-time only

    spec = meta[f"{name}/.zarray"]
    data = numcodecs.get_codec(spec["compressor"]).decode(read_raw(f"{name}/{key}"))
    for item in reversed(spec["filters"] or []):
        data = numcodecs.get_codec(item).decode(data)
    array = np.frombuffer(data, dtype=spec["dtype"])
    return array if name in ("time", "lat", "lon") else array.reshape(spec["chunks"])


def month_days(d):
    return d.day  # timestamps are month ends


# ---------- SPI-3 (gamma, McKee et al. 1993; Thom 1958 maximum-likelihood approximation) ----------
def gamma_fit(values):
    """Returns (alpha, beta, q) for nonnegative values; q is the share of zeros."""
    x = np.asarray(values, dtype=float)
    positive = x[x > 0]
    q = 1 - positive.size / x.size
    require(positive.size >= 10, "Too few non-zero values for a gamma fit")
    mean = positive.mean()
    a = math.log(mean) - np.log(positive).mean()
    alpha = (1 + math.sqrt(1 + 4 * a / 3)) / (4 * a)
    return alpha, mean / alpha, q


def gammainc(a, x):
    """Regularised lower incomplete gamma P(a, x) (series / continued fraction, Numerical Recipes)."""
    if x <= 0:
        return 0.0
    gln = math.lgamma(a)
    if x < a + 1:
        term = total = 1 / a
        n = a
        for _ in range(1000):
            n += 1
            term *= x / n
            total += term
            if abs(term) < abs(total) * 1e-15:
                break
        return total * math.exp(-x + a * math.log(x) - gln)
    b, c, d = x + 1 - a, 1 / 1e-300, 1 / (x + 1 - a)
    h = d
    for i in range(1, 1000):
        an = -i * (i - a)
        b += 2
        d = an * d + b
        d = 1e-300 if abs(d) < 1e-300 else d
        c = b + an / c
        c = 1e-300 if abs(c) < 1e-300 else c
        d = 1 / d
        delta = d * c
        h *= delta
        if abs(delta - 1) < 1e-15:
            break
    return 1 - math.exp(-x + a * math.log(x) - gln) * h


def norm_ppf(p):
    """Inverse standard normal CDF by bisection on erf (exact to ~1e-12; speed is irrelevant here)."""
    lo, hi = -10.0, 10.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if 0.5 * (1 + math.erf(mid / math.sqrt(2))) < p:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def spi(value, alpha, beta, q):
    probability = q + (1 - q) * gammainc(alpha, value / beta) if value > 0 else q
    probability = min(max(probability, 1e-6), 1 - 1e-6)  # bounds SPI to about ±4.75; reported, never hidden
    return norm_ppf(probability)


def spi_class(value):
    for item in SPI_CLASSES:
        if (item["min"] is None or value >= item["min"]) and (item["max"] is None or value < item["max"]):
            return item["id"]
    raise ValueError("SPI class gap")


def r(value, digits=3):
    return None if value is None or not math.isfinite(value) else round(float(value), digits)


def build():
    require(PINNED, "Run --download first to pin the POWER chunks")
    meta = json.loads(read_raw(".zmetadata"))["metadata"]
    times = decode("time", "0", meta)
    lat, lon = decode("lat", "0", meta), decode("lon", "0", meta)
    require(meta["time/.zattrs"]["units"] == "days since 1981-01-31 00:00:00", "Unexpected POWER time units")
    months = [date(1981, 1, 31) + timedelta(days=int(t)) for t in times]
    require(all((b.year * 12 + b.month) - (a.year * 12 + a.month) == 1 for a, b in zip(months, months[1:])), "POWER months are not consecutive")
    data = {}
    for name in VARIABLES:
        require(meta[f"{name}/.zarray"]["chunks"] == [588, 30, 30], f"Unexpected chunking for {name}")
        top = np.concatenate([decode(name, "0.7.13", meta), decode(name, "0.7.14", meta)], axis=2)
        bottom = np.concatenate([decode(name, "0.8.13", meta), decode(name, "0.8.14", meta)], axis=2)
        data[name] = np.concatenate([top, bottom], axis=1)  # time x lat(210..269) x lon(390..449)
    lat_sub, lon_sub = lat[210:270], lon[390:450]
    country = nepal_country()
    equal_area = shape(transform_geom("EPSG:4326", "EPSG:6933", mapping(country)))
    cells = []
    for i, la in enumerate(lat_sub):
        for j, lo in enumerate(lon_sub):
            footprint = box(lo - 0.3125, la - 0.25, lo + 0.3125, la + 0.25)
            if not footprint.intersects(country):
                continue
            inside = shape(transform_geom("EPSG:4326", "EPSG:6933", mapping(footprint.intersection(country)))).area / 1e6
            if inside < 1:
                continue
            total = shape(transform_geom("EPSG:4326", "EPSG:6933", mapping(footprint))).area / 1e6
            cells.append({"i": i, "j": j, "lat": float(la), "lon": float(lo), "nepal_area_km2": inside, "cell_area_km2": total})
    require(abs(sum(c["nepal_area_km2"] for c in cells) - equal_area.area / 1e6) < 1, "Cell areas do not partition Nepal")
    # Latest month with every variable finite in every Nepal cell.
    finite = np.ones(len(months), dtype=bool)
    for name in VARIABLES:
        values = np.stack([data[name][:, c["i"], c["j"]] for c in cells], axis=1)
        finite &= np.isfinite(values).all(axis=1)
    latest = int(np.where(finite)[0].max())
    require(finite[latest - RECENT_MONTHS - 2: latest + 1].all(), "Recent POWER months are incomplete")
    base_idx = [k for k, m in enumerate(months) if BASELINE[0] <= m.year <= BASELINE[1]]
    require(len(base_idx) == 360 and finite[base_idx].all(), "Baseline months incomplete")
    recent_idx = list(range(latest - RECENT_MONTHS + 1, latest + 1))
    out_cells = []
    for n, c in enumerate(cells):
        series = {name: data[name][:, c["i"], c["j"]].astype(float) for name in VARIABLES}
        normals = {name: [r(np.mean([series[name][k] for k in base_idx if months[k].month == m]), 3) for m in range(1, 13)] for name in VARIABLES}
        t_std = [r(np.std([series["T2M_MAX"][k] for k in base_idx if months[k].month == m], ddof=1), 3) for m in range(1, 13)]
        # 3-month precipitation totals in mm (rate x days, summed); baseline per calendar end-month.
        totals = np.array([series["PRECTOTCORR"][k] * month_days(months[k]) for k in range(len(months))])
        # Rounded to the published precision first, so the fit is exactly reproducible from the artifact.
        three = {k: round(float(totals[k - 2: k + 1].sum()), 3) for k in range(2, len(months)) if finite[k - 2: k + 1].all()}
        fits = []
        for m in range(1, 13):
            sample = [three[k] for k in base_idx if months[k].month == m and k in three]
            alpha, beta, q = gamma_fit(sample)
            fits.append({"alpha": r(alpha, 6), "beta": r(beta, 6), "q": r(q, 6), "n": len(sample)})
        recent = []
        for k in recent_idx:
            m = months[k].month - 1
            p_norm, t_norm = normals["PRECTOTCORR"][m], normals["T2M_MAX"][m]
            fit = fits[m]
            value = spi(three[k], fit["alpha"], fit["beta"], fit["q"])
            recent.append({
                "precip_mm_day": r(series["PRECTOTCORR"][k], 2), "precip_anomaly_mm_day": r(series["PRECTOTCORR"][k] - p_norm, 2),
                "precip_percent_of_normal": r(100 * series["PRECTOTCORR"][k] / p_norm, 1) if p_norm >= 0.1 else None,
                "snowfall_mm_day": r(series["PRECSNOLAND"][k], 2), "snow_depth_cm": r(series["SNODP"][k], 2),
                "snow_depth_anomaly_cm": r(series["SNODP"][k] - normals["SNODP"][m], 2),
                "snow_cover_fraction": r(series["FRSNO"][k], 3), "snow_cover_anomaly": r(series["FRSNO"][k] - normals["FRSNO"][m], 3),
                "tmax_c": r(series["T2M_MAX"][k], 2), "tmax_anomaly_c": r(series["T2M_MAX"][k] - t_norm, 2),
                "tmax_z": r((series["T2M_MAX"][k] - t_norm) / t_std[m], 2) if t_std[m] and t_std[m] > 0 else None,
                "precip_3mo_mm": r(three[k], 3), "spi3": r(value, 3), "spi3_class": spi_class(round(value, 3)),
            })
        out_cells.append({
            "id": f"power-{c['lat']:.2f}-{c['lon']:.3f}", "lat": c["lat"], "lon": c["lon"],
            "bounds": [c["lon"] - 0.3125, c["lat"] - 0.25, c["lon"] + 0.3125, c["lat"] + 0.25],
            "nepal_area_km2": r(c["nepal_area_km2"], 1), "cell_area_km2": r(c["cell_area_km2"], 1),
            "normals": normals, "tmax_baseline_std_c": t_std, "spi3_fit": fits,
            "baseline_precip_3mo_mm": [[r(three[k], 3) for k in base_idx if months[k].month == m and k in three] for m in range(1, 13)],
            "recent": recent,
        })
    weights = np.array([c["nepal_area_km2"] for c in out_cells])
    national = []
    for n_month, k in enumerate(recent_idx):
        share = {item["id"]: 0.0 for item in SPI_CLASSES}
        for c, w in zip(out_cells, weights):
            share[c["recent"][n_month]["spi3_class"]] += w / weights.sum()
        national.append({
            "month": months[k].strftime("%Y-%m"),
            "precip_anomaly_mm_day": r(sum(c["recent"][n_month]["precip_anomaly_mm_day"] * w for c, w in zip(out_cells, weights)) / weights.sum(), 2),
            "tmax_anomaly_c": r(sum(c["recent"][n_month]["tmax_anomaly_c"] * w for c, w in zip(out_cells, weights)) / weights.sum(), 2),
            "spi3_area_share": {key: r(v, 4) for key, v in share.items()},
        })
    context = {
        "format": "atlas-power-context@1", "grid": {"lat_step": 0.5, "lon_step": 0.625, "cell_centre_convention": "POWER lat/lon are cell centres"},
        "variables": VARIABLES, "baseline": list(BASELINE), "recent_months": [months[k].strftime("%Y-%m") for k in recent_idx],
        "latest_month": months[latest].strftime("%Y-%m"), "spi_classes": SPI_CLASSES,
        "spi_method": "SPI-3: 3-month precipitation totals (PRECTOTCORR x days) fitted per calendar end-month over 1991-2020 with a two-parameter gamma (Thom MLE) and a zero-probability term, transformed to a standard normal deviate.",
        "cells": out_cells, "national": national,
    }
    return context, months[latest]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true", help="Fetch and pin the POWER chunks covering Nepal")
    parser.add_argument("--retrieved", default="2026-10-07T17:30:00Z")
    args = parser.parse_args()
    if args.download:
        print(json.dumps(download(), indent=2))
        return
    context, latest = build()
    raw = gzip_bytes(encode(context))
    metadata = {
        "dataset_name": "Nepal gridded monthly rainfall, snow, drought (SPI-3) and heat context — NASA POWER MERRA-2",
        "source": "NASA POWER v10.0.0 monthly UTC time series (MERRA-2), AWS Open Data Zarr store",
        "source_url": REGISTRY_URL, "license": "CC BY 4.0", "license_url": "https://creativecommons.org/licenses/by/4.0/",
        "attribution": "Data obtained from the NASA Langley Research Center (LaRC) POWER Project funded through the NASA Earth Science/Applied Science Program (POWER v10.0.0, MERRA-2). Licensed CC BY 4.0.",
        "observation_date": latest.strftime("%Y-%m-%dT00:00:00Z"), "publication_date": "2026-09-14T16:00:58Z", "retrieval_date": args.retrieved,
        "processing_date": args.retrieved, "processing_version": "power-context/1.0.0",
        "method": "Pinned the four POWER Zarr chunks covering Nepal for PRECTOTCORR, PRECSNOLAND, SNODP, FRSNO and T2M_MAX; kept native 0.5 x 0.625 degree cells whose area intersects the COD-AB v02 Nepal boundary (EPSG:6933 area fractions). Monthly normals and T2M_MAX standard deviations over 1991-2020; latest 12 months as values and anomalies; SPI-3 by gamma fit per calendar month (McKee et al. 1993).",
        "evidence_type": "modelled", "status": "MODELLED", "is_fixture": False,
        "spatial_resolution": {"unit": "degree", "value": 0.5}, "temporal_resolution": "P1M (monthly means; cells 0.5 deg latitude x 0.625 deg longitude)",
        "crs": "OGC:CRS84", "update_frequency": "periodic",
        # POWER adds a month roughly two weeks after it ends; after this date a newer month should exist.
        "stale_after": (date(latest.year + (latest.month + 2) // 12, (latest.month + 2) % 12 + 1, 1)).strftime("%Y-%m-%dT00:00:00Z"),
        "limitations": [
            "MERRA-2 is a reanalysis: modelled fields constrained by observations, not station measurements. Each cell is about 55 x 60 km and cannot resolve valleys, slopes or individual settlements.",
            "PRECTOTCORR is a monthly mean daily rate (mm/day). Monthly totals use the number of days in the month; daily extremes and cloudbursts are not represented.",
            "SPI-3 compares a 3-month total with the 1991-2020 distribution for the same months in that cell. It is a relative dryness/wetness index, not a drought declaration, crop or water-supply impact, or forecast.",
            "In the dry season (about November-April) 3-month totals are small, so modest absolute differences can give large SPI magnitudes; read SPI together with the millimetre totals.",
            "T2M_MAX is the highest hourly 2 m temperature in the month. A positive anomaly is not a heatwave classification; heat-health impacts are UNKNOWN.",
            "Snow depth and snow-cover fraction are model land-surface outputs and are known to be uncertain over high mountains and glaciers.",
            "Cells partly outside Nepal are kept whole and labelled with their Nepal area share; values are not reallocated.",
            "This is a periodically refreshed snapshot (latest month shown), not a monitoring service. Official climate information comes from DHM.",
        ],
        "uncertainty": "No per-cell uncertainty is supplied by POWER; reanalysis error over complex terrain is UNKNOWN. SPI gamma fits use 30 samples per calendar month.",
        "spatial_coverage": {"description": "Native POWER cells intersecting Nepal", "bbox": [80.0, 26.25, 88.6, 30.5]},
        "temporal_coverage": {"start": "1991-01-01T00:00:00Z", "end": latest.strftime("%Y-%m-%dT23:59:59Z")},
    }
    inputs = [input_reference("nepal-admin-country", "2.0.1")] + [
        external_input("nasa-power-merra2-monthly-zarr", "10.0.0", f"POWER Zarr {key}", pin["sha256"], STORE + key)
        for key, pin in sorted(PINNED.items()) if key != "LICENSE.txt"] + [
        external_input("nasa-power-license", "10.0.0", "NASA POWER bucket LICENSE.txt (CC BY 4.0)", PINNED["LICENSE.txt"]["sha256"], LICENSE_FILE_URL)]
    summary = {
        "cells": len(context["cells"]), "latest_month": context["latest_month"], "baseline": context["baseline"],
        "recent_months": context["recent_months"], "variables": list(VARIABLES), "notice_files": [],
    }
    manifest = publish(ID, VERSION, "climate-context", metadata, inputs, {"context": ("context.json.gz", raw, "application/json+gzip")}, summary)
    print(f"Published {ID}@{VERSION}: {summary['cells']} cells, latest {summary['latest_month']}")
    return manifest


@semantic("climate-context")
def verify_power_context(directory, manifest):
    context = read_json_artifact(directory, manifest, "context")
    require(context["format"] == "atlas-power-context@1" and context["baseline"] == list(BASELINE), "Unsupported climate context")
    require(len(context["cells"]) == manifest["summary"]["cells"] and context["latest_month"] == manifest["summary"]["latest_month"], "Climate summary differs")
    require(len(context["recent_months"]) == RECENT_MONTHS and context["recent_months"][-1] == context["latest_month"], "Recent window differs")
    for cell in context["cells"]:
        require(0 < cell["nepal_area_km2"] <= cell["cell_area_km2"] + 0.1, "Invalid Nepal area share")
        require(all(len(cell["normals"][v]) == 12 for v in VARIABLES), "Normals must have 12 months")
        require(len(cell["recent"]) == RECENT_MONTHS, "Recent values incomplete")
        for m, fit in enumerate(cell["spi3_fit"]):
            sample = cell["baseline_precip_3mo_mm"][m]
            alpha, beta, q = gamma_fit(sample)
            require(abs(alpha - fit["alpha"]) < 1e-5 * max(1, alpha) and abs(beta - fit["beta"]) < 1e-5 * max(1, beta) and abs(q - fit["q"]) < 1e-6,
                    "SPI gamma fit is not reproducible from the published baseline")
        for row, month in zip(cell["recent"], context["recent_months"]):
            m = int(month[5:]) - 1
            fit = cell["spi3_fit"][m]
            require(abs(spi(row["precip_3mo_mm"], fit["alpha"], fit["beta"], fit["q"]) - row["spi3"]) < 2e-3, "SPI value is not reproducible")
            require(row["spi3_class"] == spi_class(row["spi3"]), "SPI class differs from McKee thresholds")
            require(row["precip_mm_day"] >= 0 and 0 <= row["snow_cover_fraction"] <= 1 and row["snow_depth_cm"] >= 0, "Physical bounds violated")
    for row in context["national"]:
        require(abs(sum(row["spi3_area_share"].values()) - 1) < 1e-3, "SPI area shares must sum to 1")


if __name__ == "__main__":
    main()
