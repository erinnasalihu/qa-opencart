"""TC-AUTH-001 — Valid customer login.

Maps to manual TC-AUTH-001. Confirms a registered customer can log in and
land on the account dashboard.
"""
import pytest
from pages.login_page import LoginPage


@pytest.mark.smoke
@pytest.mark.p1
def test_valid_login(driver, config):
    page = LoginPage(driver, config["base_url"]).go()
    page.login(config["users"]["valid"]["email"],
               config["users"]["valid"]["password"])
    assert page.url_contains("route=account/account"), \
        f"Expected account dashboard, got {driver.current_url}"
