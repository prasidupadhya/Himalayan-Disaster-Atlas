"""Registry of every model-release semantic verifier (import registers each release type)."""

from . import (  # noqa: F401
    evidence_corpus,
    flood_corridors,
    gmpe,
    population_hrsl,
    power_context,
    terrain_steepness,
)
from .model_release import verify as verify_model_release

__all__ = ["verify_model_release"]
