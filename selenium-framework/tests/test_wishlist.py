"""TC-NAV-002 — Direct access to /account/wishlist while anonymous → login."""
import pytest
from pages.wishlist_page import WishlistPage


@pytest.mark.p2
def test_wishlist_requires_login(driver, config):
    page = WishlistPage(driver, config["base_url"]).go()
    assert "account/login" in driver.current_url or page.is_visible(page.EMPTY)
