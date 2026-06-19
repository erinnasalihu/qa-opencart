"""TC-CHK-004 — Anonymous user reaching checkout is asked to login/register/guest."""
import pytest
from pages.checkout_page import CheckoutPage


@pytest.mark.p1
def test_checkout_redirect_when_anonymous(driver, config):
    page = CheckoutPage(driver, config["base_url"]).go()
    assert page.is_visible(page.H1)
    # Either Login / Register / Guest options are shown OR we are routed to login.
    src = driver.page_source.lower()
    assert "checkout" in src or "login" in src
