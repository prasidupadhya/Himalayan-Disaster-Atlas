import copy
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.live_conditions import POLICY, check_policy
from pipelines.atlas_pipeline.live_registration import verify_registration

RELEASE = ROOT / "data/releases/atlas-live-conditions/1.0.0"
PUBLIC = ROOT / "apps/web/public/data/atlas-live-conditions/1.0.0"


def policy():
    return json.loads((ROOT / POLICY).read_bytes())


class LiveConditionsPolicyTest(unittest.TestCase):
    def test_checked_in_policy_is_valid_and_registered_byte_for_byte(self):
        check_policy(policy())
        manifest = verify_registration(RELEASE, PUBLIC)
        self.assertEqual(manifest["id"], "atlas-live-conditions")
        self.assertEqual((RELEASE / "policy.json").read_bytes(), (ROOT / POLICY).read_bytes())

    def test_rejects_claims_of_immediacy_in_either_language(self):
        for lang, text in (("en", "Real-time conditions"), ("ne", "वास्तविक समय अवस्था")):
            value = copy.deepcopy(policy())
            value["copy"][lang]["notice"] = text
            with self.assertRaisesRegex(ValueError, "immediacy"):
                check_policy(value)

    def test_rejects_missing_translation_or_placeholder_drift(self):
        value = copy.deepcopy(policy())
        del value["copy"]["ne"]["warn_text"]
        with self.assertRaisesRegex(ValueError, "keys differ"):
            check_policy(value)
        value = copy.deepcopy(policy())
        value["copy"]["ne"]["eq_ready"] = value["copy"]["ne"]["eq_ready"].replace("{n}", "")
        with self.assertRaisesRegex(ValueError, "placeholders"):
            check_policy(value)

    def test_rejects_colour_only_or_ambiguous_labels(self):
        value = copy.deepcopy(policy())
        value["purposes"]["forecast"]["glyph"] = value["purposes"]["observation"]["glyph"]
        with self.assertRaisesRegex(ValueError, "glyph"):
            check_policy(value)
        value = copy.deepcopy(policy())
        value["freshness"]["STALE"]["en"] = "FRESH"
        with self.assertRaisesRegex(ValueError, "label"):
            check_policy(value)

    def test_impacts_stay_unknown(self):
        value = copy.deepcopy(policy())
        value["copy"]["en"]["impact_text"] = "Damage is estimated at 10 buildings."
        with self.assertRaisesRegex(ValueError, "unknown impacts"):
            check_policy(value)


if __name__ == "__main__":
    unittest.main()
