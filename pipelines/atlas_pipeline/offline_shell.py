"""Register the offline-shell cache policy as original MIT metadata, never cached readings."""

import json
import re

from .contracts import ROOT
from .live_contracts import require
from .live_registration import register

POLICY = "packages/contracts/offline-shell-policy.json"
FORBIDDEN = ("real-time", "real time", "realtime", "वास्तविक समय")


def check_policy(policy):
    en, ne = policy["copy"]["en"], policy["copy"]["ne"]
    require(set(en) == set(ne), "Offline copy keys differ between English and Nepali")
    for key, text in en.items():
        require(
            sorted(re.findall(r"\{\w+\}", text)) == sorted(re.findall(r"\{\w+\}", ne[key])),
            f"Offline placeholders differ: {key}",
        )
    require(
        policy["last_known"]["en"] == "LAST KNOWN"
        and "LAST KNOWN" in en["last_known_notice"]
        and "not rechecked" in en["last_known_notice"].lower(),
        "Offline copies must be labelled LAST KNOWN and not rechecked",
    )
    require(
        not any(term in json.dumps(policy, ensure_ascii=False).lower() for term in FORBIDDEN),
        "Offline copy must not claim immediacy",
    )
    pages = policy["shell_pages"]
    require(
        "/live/" in pages and "/offline/" in pages and all(p.startswith("/") and p.endswith("/") for p in pages),
        "Offline shell must pin the live and offline pages",
    )
    require(
        0 < policy["live_retention_seconds"] <= 30 * 86400
        and 1000 <= policy["network_timeout_ms"] <= 30000
        and 0 < policy["shell_budget_bytes"] <= 8 * 1048576,
        "Offline retention, timeout or budget is outside its reviewed bounds",
    )
    return policy


def main():
    check_policy(json.loads((ROOT / POLICY).read_bytes()))
    register(
        "atlas-live-offline-shell",
        "Offline shell cache policy (not readings)",
        "offline-shell/1.0.0: checksum-pinned app shell, network-first live data, "
        "last-known labelling, integrity re-verification and bounded retention",
        POLICY,
        [
            "Cache policy metadata only; it contains no readings and grants no rights to source data.",
            "Offline copies are last-known device copies, never current checks; expired copies are deleted.",
            "No official warning, damage, loss, inundation or casualty output is produced.",
        ],
    )


if __name__ == "__main__":
    main()
