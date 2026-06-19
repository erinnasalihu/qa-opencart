"""TC-AUTH-008 — Logout clears session and returns to anonymous landing."""
import pytest
from pages.login_page import LoginPage
from pages.account_page import AccountPage


@pytest.mark.p1
def test_logout(driver, config):
    LoginPage(driver, config["base_url"]).go().login(
        config["users"]["valid"]["email"],
        config["users"]["valid"]["password"],
    )
    ap = AccountPage(driver, config["base_url"]).go()
    ap.logout()
    assert "account/logout" in driver.current_url or "common/home" in driver.current_url
