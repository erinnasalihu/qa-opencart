import os, yaml


def load_config(path: str = "config/config.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    # env overrides
    cfg["base_url"] = os.environ.get("BASE_URL", cfg["base_url"])
    cfg["browser"]  = os.environ.get("BROWSER", cfg.get("browser", "chrome"))
    cfg["headless"] = os.environ.get("HEADLESS", "1") == "1"
    return cfg
