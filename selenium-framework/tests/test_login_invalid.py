"""TC-AUTH-002 / TC-AUTH-003 / TC-AUTH-004 — Invalid credentials matrix."""
import pytest
from pages.login_page import LoginPage


@pytest.mark.p1
@pytest.mark.parametrize("email,password,kind", [
    ("qa.valid@test.local", "wrong-pw",          "wrong-password"),
    ("no.such.user@test.local", "Pass@123",      "unknown-email"),
    ("", "",                                     "empty"),
    ("not-an-email", "Pass@123",                 "malformed"),
])
def test_invalid_login(driver, config, email, password, kind):
    page = LoginPage(driver, config["base_url"]).go().login(email, password)
    msg = page.error_text()
    assert any(s in msg for s in ("No match", "Warning", "exceeded", "Required")), \
        f"Did not see the expected validation banner for kind={kind}; got: {msg!r}"
