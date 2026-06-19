"""TC-CART-002 — Remove product line empties the cart."""
import pytest
from pages.product_page import ProductPage
from pages.cart_page import CartPage


@pytest.mark.p1
def test_remove_from_cart(driver, config):
    pid = config["products"]["in_stock"]
    ProductPage(driver, config["base_url"]).go(pid).add_to_cart(1)
    cp = CartPage(driver, config["base_url"]).go()
    assert cp.line_count() >= 1, "precondition: cart should contain a line"
    cp.click(cp.REMOVE_BTN)
    cp.driver.refresh()
    assert cp.is_empty() or cp.line_count() == 0
