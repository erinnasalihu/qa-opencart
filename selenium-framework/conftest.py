"""Pytest root configuration: shared fixtures, screenshot-on-fail, html report."""
import os, datetime, pytest
from utils.driver_factory import build
from utils.config_loader import load_config
from utils.logger import configure as configure_logging

configure_logging("INFO")


@pytest.fixture(scope="session")
def config():
    return load_config(os.environ.get("CONFIG", "config/config.yaml"))


@pytest.fixture
def driver(config, request):
    drv = build(config["browser"], config["headless"])
    drv.implicitly_wait(config.get("implicit_wait", 5))
    yield drv
    # Take a screenshot if the test failed
    rep = getattr(request.node, "rep_call", None)
    if rep is not None and rep.failed:
        ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        os.makedirs("reports/screenshots", exist_ok=True)
        path = f"reports/screenshots/{request.node.name}-{ts}.png"
        try:
            drv.save_screenshot(path)
            print(f"\n[screenshot] {path}")
        except Exception as e:
            print(f"[screenshot-failed] {e}")
    try:
        drv.quit()
    except Exception:
        pass


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    setattr(item, f"rep_{call.when}", outcome.get_result())
