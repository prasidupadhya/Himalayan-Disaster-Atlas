import copy
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.live_registration import verify_registration
from pipelines.atlas_pipeline.offline_shell import POLICY, check_policy

RELEASE = ROOT / "data/releases/atlas-live-offline-shell/1.1.0"
PUBLIC = ROOT / "apps/web/public/data/atlas-live-offline-shell/1.1.0"


def policy():
    return json.loads((ROOT / POLICY).read_bytes())


class OfflineShellPolicyTest(unittest.TestCase):
    def test_checked_in_policy_is_valid_and_registered_byte_for_byte(self):
        check_policy(policy())
        self.assertEqual(verify_registration(RELEASE, PUBLIC)["id"], "atlas-live-offline-shell")
        self.assertEqual((RELEASE / "policy.json").read_bytes(), (ROOT / POLICY).read_bytes())

    def test_offline_copies_must_say_last_known_and_not_rechecked(self):
        value = copy.deepcopy(policy())
        value["copy"]["en"]["last_known_notice"] = "Saved {time}."
        with self.assertRaisesRegex(ValueError, "LAST KNOWN"):
            check_policy(value)
        value = copy.deepcopy(policy())
        value["last_known"]["en"] = "CURRENT"
        with self.assertRaisesRegex(ValueError, "LAST KNOWN"):
            check_policy(value)

    def test_rejects_immediacy_and_translation_drift(self):
        value = copy.deepcopy(policy())
        value["copy"]["ne"]["offline_banner"] = "वास्तविक समय"
        with self.assertRaisesRegex(ValueError, "immediacy"):
            check_policy(value)
        value = copy.deepcopy(policy())
        value["copy"]["ne"]["last_known_feed"] = "पुरानो प्रति"
        with self.assertRaisesRegex(ValueError, "placeholders"):
            check_policy(value)

    def test_bounds_retention_timeout_budget_and_pinned_pages(self):
        for key, bad in (("live_retention_seconds", 0), ("live_retention_seconds", 90 * 86400), ("network_timeout_ms", 60000), ("shell_budget_bytes", 64 * 1048576)):
            value = copy.deepcopy(policy())
            value[key] = bad
            with self.assertRaisesRegex(ValueError, "bounds"):
                check_policy(value)
        value = copy.deepcopy(policy())
        value["shell_pages"].remove("/live/")
        with self.assertRaisesRegex(ValueError, "live and offline"):
            check_policy(value)


if __name__ == "__main__":
    unittest.main()
