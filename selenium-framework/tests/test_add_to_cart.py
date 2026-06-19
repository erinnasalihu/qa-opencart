"""TC-CART-001 — Add product to cart updates header counter."""
import pytest
from pages.product_page import ProductPage
from pages.cart_page import CartPage


@pytest.mark.smoke
@pytest.mark.p1
def test_add_product_to_cart(driver, config):
    pid = config["products"]["in_stock"]
    pp = ProductPage(driver, config["base_url"]).go(pid).add_to_cart(1)
    assert pp.success_visible(), "Expected success toast after add-to-cart"
    cp = CartPage(driver, config["base_url"]).go()
    assert cp.line_count() >= 1
