"""TC-REG-001 — Valid registration creates customer record."""
import time, pytest
from faker import Faker
from pages.register_page import RegisterPage

fake = Faker()


@pytest.mark.p1
def test_register_new_customer(driver, config):
    email = f"qa.new+{int(time.time())}@test.local"
    page = RegisterPage(driver, config["base_url"]).go()
    page.register(
        firstname=fake.first_name(),
        lastname=fake.last_name(),
        email=email,
        telephone="+38344123456",
        password="Pass@123",
        agree=True,
    )
    assert page.url_contains("account/success") or page.success_visible(), \
        f"Registration did not reach success page; url={driver.current_url}"
