"""Feature 51: BSSA14 ground-motion model (Boore, Stewart, Seyhan & Atkinson 2014).

Independent implementation of the published NGA-West2 equations for PGA and PGV
(Earthquake Spectra 30(3):1057-1085, doi:10.1193/070113EQS184M). Coefficients are the paper's
global (California/Taiwan, Dc3 = 0) values. No basin term (Z1 unknown) is applied.
"""

import json
import math
from datetime import datetime, timezone

from .contracts import ROOT
from .live_contracts import require
from .model_release import encode, publish, read_json_artifact, semantic

ID, VERSION = "atlas-gmpe-bssa14", "1.0.0"
CONSTANTS = {"Mref": 4.5, "Rref": 1.0, "Vref": 760.0, "f1": 0.0, "f3": 0.1, "v1": 225.0, "v2": 300.0}
COEFFICIENTS = {
    "pga": {"e0": 0.4473, "e1": 0.4856, "e2": 0.2459, "e3": 0.4539, "e4": 1.431, "e5": 0.05053, "e6": -0.1662, "Mh": 5.5,
            "c1": -1.134, "c2": 0.1917, "c3": -0.008088, "h": 4.5, "Dc3": 0.0, "c": -0.6, "Vc": 1500.0, "f4": -0.15,
            "f5": -0.00701, "R1": 110.0, "R2": 270.0, "DfR": 0.1, "DfV": 0.07, "phi1": 0.695, "phi2": 0.495,
            "tau1": 0.398, "tau2": 0.348},
    "pgv": {"e0": 5.037, "e1": 5.078, "e2": 4.849, "e3": 5.033, "e4": 1.073, "e5": -0.1536, "e6": 0.2252, "Mh": 6.2,
            "c1": -1.243, "c2": 0.1489, "c3": -0.00344, "h": 5.3, "Dc3": 0.0, "c": -0.84, "Vc": 1300.0, "f4": -0.1,
            "f5": -0.00844, "R1": 105.0, "R2": 272.0, "DfR": 0.082, "DfV": 0.08, "phi1": 0.644, "phi2": 0.552,
            "tau1": 0.401, "tau2": 0.346},
}
MECHANISMS = {"unspecified": "e0", "strike-slip": "e1", "normal": "e2", "reverse": "e3"}
DOMAIN = {"magnitude": [3.0, 8.5], "normal_magnitude_max": 7.0, "rjb_km": [0.0, 400.0], "vs30_m_s": [150.0, 1500.0]}


def _base(c, magnitude, rjb, mechanism):
    m = magnitude - c["Mh"]
    fe = c[MECHANISMS[mechanism]] + (c["e4"] * m + c["e5"] * m * m if magnitude <= c["Mh"] else c["e6"] * m)
    r = math.sqrt(rjb * rjb + c["h"] * c["h"])
    fp = (c["c1"] + c["c2"] * (magnitude - CONSTANTS["Mref"])) * math.log(r / CONSTANTS["Rref"]) + (c["c3"] + c["Dc3"]) * (r - CONSTANTS["Rref"])
    return fe + fp


def _sigma(c, magnitude, rjb, vs30):
    def between(a, b):
        return a if magnitude <= 4.5 else b if magnitude >= 5.5 else a + (b - a) * (magnitude - 4.5)
    tau, phi = between(c["tau1"], c["tau2"]), between(c["phi1"], c["phi2"])
    if rjb > c["R2"]:
        phi += c["DfR"]
    elif rjb > c["R1"]:
        phi += c["DfR"] * math.log(rjb / c["R1"]) / math.log(c["R2"] / c["R1"])
    if vs30 <= CONSTANTS["v1"]:
        phi -= c["DfV"]
    elif vs30 < CONSTANTS["v2"]:
        phi -= c["DfV"] * math.log(CONSTANTS["v2"] / vs30) / math.log(CONSTANTS["v2"] / CONSTANTS["v1"])
    return math.sqrt(tau * tau + phi * phi), tau, phi


def ground_motion(imt, magnitude, rjb, vs30, mechanism="unspecified"):
    """Median (PGA in g, PGV in cm/s) and natural-log standard deviations."""
    require(imt in COEFFICIENTS and mechanism in MECHANISMS, "Unsupported intensity measure or mechanism")
    require(all(math.isfinite(v) for v in (magnitude, rjb, vs30)), "Inputs must be finite")
    upper = DOMAIN["normal_magnitude_max"] if mechanism == "normal" else DOMAIN["magnitude"][1]
    require(DOMAIN["magnitude"][0] <= magnitude <= upper and DOMAIN["rjb_km"][0] <= rjb <= DOMAIN["rjb_km"][1]
            and DOMAIN["vs30_m_s"][0] <= vs30 <= DOMAIN["vs30_m_s"][1], "Input outside the BSSA14 domain; refused rather than extrapolated")
    c = COEFFICIENTS[imt]
    ln_rock_pga = _base(COEFFICIENTS["pga"], magnitude, rjb, mechanism)
    linear = c["c"] * math.log(min(vs30, c["Vc"]) / CONSTANTS["Vref"])
    f2 = c["f4"] * (math.exp(c["f5"] * (min(vs30, 760.0) - 360.0)) - math.exp(c["f5"] * (760.0 - 360.0)))
    nonlinear = CONSTANTS["f1"] + f2 * math.log((math.exp(ln_rock_pga) + CONSTANTS["f3"]) / CONSTANTS["f3"])
    ln_median = _base(c, magnitude, rjb, mechanism) + linear + nonlinear
    total, tau, phi = _sigma(c, magnitude, rjb, vs30)
    return {"median": math.exp(ln_median), "ln_median": ln_median, "sigma": total, "tau": tau, "phi": phi}


def main():
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    model = {"format": "atlas-gmpe@1", "model": "BSSA14", "reference": "Boore, D.M., Stewart, J.P., Seyhan, E. & Atkinson, G.M. (2014). NGA-West2 equations for predicting PGA, PGV, and 5% damped PSA for shallow crustal earthquakes. Earthquake Spectra 30(3), 1057-1085. doi:10.1193/070113EQS184M",
             "doi": "10.1193/070113EQS184M", "region": "global (Dc3 = 0)", "constants": CONSTANTS, "coefficients": COEFFICIENTS,
             "mechanisms": MECHANISMS, "domain": DOMAIN, "units": {"pga": "g", "pgv": "cm/s", "rjb": "km", "vs30": "m/s"},
             "omitted": ["basin depth term (Z1 UNKNOWN)", "regional anelastic adjustment (global Dc3 = 0 used)", "spatial correlation of within-event residuals"]}
    summary = {"model": "BSSA14", "intensity_measures": ["pga", "pgv"], "domain": DOMAIN, "notice_files": []}
    metadata = {
        "dataset_name": "Ground-motion model BSSA14 (NGA-West2) for educational earthquake scenarios",
        "source": "Boore et al. (2014), Earthquake Spectra 30(3):1057-1085, global coefficients", "source_url": "https://doi.org/10.1193/070113EQS184M",
        "license": "Published scientific coefficients; Atlas implementation MIT", "license_url": "https://opensource.org/license/mit/",
        "attribution": "Boore, Stewart, Seyhan & Atkinson (2014); independent Atlas implementation verified against pygmm 0.8.0.",
        "observation_date": None, "publication_date": "2014-08-01T00:00:00Z", "retrieval_date": now, "processing_date": now,
        "processing_version": "gmpe-bssa14-1.0.0",
        "method": "Median ln PGA/PGV = F_E(M, mechanism) + F_P(R_JB, M) + F_S(V_S30, PGA_rock); total sigma from magnitude-, distance- and V_S30-dependent tau and phi. Point or declared line sources give R_JB.",
        "spatial_resolution": {"value": None, "unit": None}, "temporal_resolution": None,
        "spatial_coverage": {"description": "Model applicable to active shallow crust; no geographic data", "bbox": [79.9, 26.3, 88.3, 30.5]},
        "temporal_coverage": {"start": None, "end": None}, "crs": "OGC:CRS84", "status": "MODELLED", "evidence_type": "modelled", "is_fixture": False,
        "limitations": [
            "NGA-West2 data are dominated by California, Taiwan, Japan, China and Turkey; Himalayan megathrust behaviour is not specifically calibrated.",
            "Validity: M 3-8.5 (normal faulting M 3-7), R_JB 0-400 km, V_S30 150-1500 m/s. Outside this domain results are refused.",
            "Uniform declared V_S30 replaces unknown site conditions; Kathmandu basin amplification is not represented (no basin term).",
            "Point sources underestimate near-fault distance for large magnitudes; a declared line source is an approximation of finite rupture.",
            "Median ±1 sigma is single-site aleatory variability, not a spatially correlated scenario or a confidence interval for damage.",
            "Ground motion is not damage. Building damage, casualties and losses remain UNKNOWN (gated Feature 52).",
        ],
        "uncertainty": "Published aleatory sigma (tau, phi) only; epistemic model uncertainty across GMPEs is not represented.",
        "update_frequency": "static", "stale_after": None,
    }
    publish(ID, VERSION, "gmpe-model", metadata, [], {"model": ("model.json", encode(model), "application/json")}, summary)


@semantic("gmpe-model")
def verify_gmpe(directory, manifest):
    model = read_json_artifact(directory, manifest, "model")
    require(model["format"] == "atlas-gmpe@1" and model["coefficients"] == COEFFICIENTS and model["constants"] == CONSTANTS,
            "Published GMPE coefficients differ from the verified implementation")
    reference = json.loads((ROOT / "tests/fixtures/gmpe-bssa14-reference.json").read_text())
    for case in reference["cases"]:
        result = ground_motion(case["imt"], case["magnitude"], case["rjb_km"], case["vs30"], case["mechanism"])
        require(abs(result["ln_median"] - math.log(case["median"])) < 1e-6 and abs(result["sigma"] - case["sigma"]) < 1e-6,
                f"BSSA14 differs from reference case {case}")


if __name__ == "__main__":
    main()
