"""Registry of every model-release semantic verifier (import registers each release type)."""

from . import flood_corridors, gmpe, population_hrsl  # noqa: F401
from .model_release import verify as verify_model_release

__all__ = ["verify_model_release"]
