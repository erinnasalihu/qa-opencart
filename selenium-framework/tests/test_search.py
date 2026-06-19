"""TC-SEARCH-001 — Existing product appears in results."""
import pytest
from pages.search_page import SearchPage


@pytest.mark.p1
def test_search_returns_results(driver, config):
    page = SearchPage(driver, config["base_url"]).go().search("iPhone")
    assert page.result_count() >= 1, "Expected ≥1 result for iPhone"


@pytest.mark.p2
def test_search_no_results(driver, config):
    page = SearchPage(driver, config["base_url"]).go().search("nonexistentXYZ123")
    assert page.result_count() == 0


@pytest.mark.p1
@pytest.mark.security
def test_search_xss_payload_is_escaped(driver, config):
    """TC-SEARCH-006 — XSS payload must be rendered as text, not executed."""
    payload = "<script>alert(1)</script>"
    page = SearchPage(driver, config["base_url"]).go().search(payload)
    # If the script ran, an alert would block driver.title. Reading title
    # without a NoAlertPresent exception means it didn't.
    assert driver.title is not None
    assert "<script>" not in driver.page_source.lower() or \
           "&lt;script&gt;" in driver.page_source.lower()
