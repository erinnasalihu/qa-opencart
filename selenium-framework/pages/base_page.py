"""BasePage — common interaction primitives shared by every page object.

This file is the bedrock of the POM: every page in `pages/` inherits from
`BasePage`, which wraps Selenium's `WebDriverWait` with the explicit-wait
strategy required for OpenCart's heavily-AJAX storefront.
"""
from __future__ import annotations
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import logging

log = logging.getLogger(__name__)
DEFAULT_TIMEOUT = 15


class BasePage:
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url.rstrip("/")
        self.wait = WebDriverWait(driver, DEFAULT_TIMEOUT)

    # ---- navigation ---------------------------------------------------- #
    def open(self, route_qs: str = "") -> "BasePage":
        if route_qs.startswith("/"):
            url = f"{self.base_url}{route_qs}"
        else:
            url = f"{self.base_url}/index.php?route={route_qs}" if route_qs else self.base_url
        log.info("GET %s", url)
        self.driver.get(url)
        return self

    # ---- elements ------------------------------------------------------ #
    def find(self, locator):
        return self.wait.until(EC.visibility_of_element_located(locator))

    def find_all(self, locator):
        self.wait.until(EC.presence_of_all_elements_located(locator))
        return self.driver.find_elements(*locator)

    def click(self, locator):
        self.wait.until(EC.element_to_be_clickable(locator)).click()

    def type(self, locator, value):
        el = self.find(locator)
        el.clear()
        el.send_keys(value)

    def is_visible(self, locator) -> bool:
        try:
            self.wait.until(EC.visibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False

    def is_present(self, locator) -> bool:
        try:
            self.driver.find_element(*locator)
            return True
        except NoSuchElementException:
            return False

    def text_of(self, locator) -> str:
        return self.find(locator).text

    # ---- assertions helpers ------------------------------------------- #
    def url_contains(self, fragment: str) -> bool:
        return self.wait.until(EC.url_contains(fragment))

    def title_contains(self, fragment: str) -> bool:
        return self.wait.until(EC.title_contains(fragment))

    def screenshot(self, path: str):
        self.driver.save_screenshot(path)
