"""TC-ADMIN-001 — Admin login → user_token query param appears in URL."""
import pytest
from pages.admin_login_page import AdminLoginPage


@pytest.mark.smoke
@pytest.mark.p1
def test_admin_valid_login(driver, config):
    page = AdminLoginPage(driver, config["base_url"], config.get("admin_path", "/administration")).go()
    page.login(config["admin"]["username"], config["admin"]["password"])
    assert "user_token=" in driver.current_url, \
        f"Expected user_token query param, got {driver.current_url}"
