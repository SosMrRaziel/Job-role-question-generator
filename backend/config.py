from pathlib import Path
import os

from dotenv import load_dotenv


load_dotenv(dotenv_path=Path(__file__).with_name(".env"))


def _clean_env_value(name, default=""):
    return os.getenv(name, default).strip().strip('"').strip("'")


AI_API_KEY = _clean_env_value("AI_API_KEY")
GEMINI_API_URL = (
    _clean_env_value("GEMINI_API_URL")
    .strip()
)
