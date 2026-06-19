from selenium.webdriver.common.by import By
from .base_page import BasePage


class ProductPage(BasePage):
    ADD_TO_CART = (By.ID, "button-cart")
    QUANTITY    = (By.ID, "input-quantity")
    SUCCESS     = (By.CSS_SELECTOR, ".alert-success, #alert .alert-success")
    NAME        = (By.CSS_SELECTOR, "h1")

    def go(self, product_id: int):
        return self.open(f"product/product&product_id={product_id}")

    def add_to_cart(self, qty: int = 1):
        self.type(self.QUANTITY, str(qty))
        self.click(self.ADD_TO_CART)
        return self

    def success_visible(self) -> bool:
        return self.is_visible(self.SUCCESS)
