"""Register the /live/ presentation policy (bilingual copy and labels) as original MIT metadata."""

import json
import re

from .contracts import ROOT
from .live_contracts import require
from .live_registration import register

POLICY = "packages/contracts/live-conditions-policy.json"
FORBIDDEN = ("real-time", "real time", "realtime", "वास्तविक समय")


def check_policy(policy):
    en, ne = policy["copy"]["en"], policy["copy"]["ne"]
    require(set(en) == set(ne), "Bulletin copy keys differ between English and Nepali")
    for key, text in en.items():
        require(
            sorted(_placeholders(text)) == sorted(_placeholders(ne[key])),
            f"Bulletin placeholders differ: {key}",
        )
    for group in ("purposes", "freshness"):
        items = policy[group].values()
        for lang in ("en", "ne"):
            labels = [item[lang] for item in items]
            require(len(set(labels)) == len(labels), f"Duplicate {group} label: {lang}")
        glyphs = [item["glyph"] for item in items]
        require(len(set(glyphs)) == len(glyphs), f"Duplicate {group} glyph")
    text = json.dumps(policy, ensure_ascii=False).lower()
    require(not any(term in text for term in FORBIDDEN), "Live copy must not claim immediacy")
    require(
        "periodically updated" in en["title"].lower() and "UNKNOWN" in en["impact_text"],
        "Live copy must state periodic updates and unknown impacts",
    )
    return policy


def _placeholders(text):
    return re.findall(r"\{\w+\}", text)


def main():
    check_policy(json.loads((ROOT / POLICY).read_bytes()))
    register(
        "atlas-live-conditions",
        "Live conditions page presentation policy (not readings)",
        "live-conditions/1.0.0: bilingual bulletin copy, non-colour purpose/freshness labels "
        "and display rules over verified snapshots",
        POLICY,
        [
            "Presentation metadata only; it contains no readings and grants no rights to source data.",
            "Nepali copy is project-authored and requires native-speaker review before operational use.",
            "No official warning, damage, loss, inundation or casualty output is produced.",
        ],
    )


if __name__ == "__main__":
    main()
