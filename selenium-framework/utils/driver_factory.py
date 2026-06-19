"""Cross-browser Selenium driver factory.

Defaults to a headless Chrome (Chromium) at 1366x768 viewport. Firefox
support is provided for the cross-browser compatibility test
(TC-COMPAT-001).
"""
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
import logging

log = logging.getLogger(__name__)


def build(browser: str = "chrome", headless: bool = True):
    browser = (browser or "chrome").lower()
    if browser == "chrome":
        opts = ChromeOptions()
        if headless:
            opts.add_argument("--headless=new")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--window-size=1366,768")
        opts.add_argument("--disable-gpu")
        # Selenium 4.21 + Selenium Manager — no webdriver-manager needed for Chrome.
        return webdriver.Chrome(options=opts)
    if browser == "firefox":
        opts = FirefoxOptions()
        if headless:
            opts.add_argument("-headless")
        opts.add_argument("--width=1366")
        opts.add_argument("--height=768")
        return webdriver.Firefox(options=opts)
    if browser == "edge":
        opts = EdgeOptions()
        if headless:
            opts.add_argument("--headless=new")
        return webdriver.Edge(options=opts)
    raise ValueError(f"Unsupported browser: {browser}")
