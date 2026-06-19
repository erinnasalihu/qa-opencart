from selenium.webdriver.common.by import By
from .base_page import BasePage


class CartPage(BasePage):
    ROWS         = (By.CSS_SELECTOR, "#cart table tbody tr, .table-bordered tbody tr")
    REMOVE_BTN   = (By.CSS_SELECTOR, "button[aria-label='Remove'], .fa-times")
    UPDATE_BTN   = (By.CSS_SELECTOR, "button.btn-update, [data-bs-original-title='Update']")
    EMPTY_MSG    = (By.XPATH, "//*[contains(., 'cart is empty')]")
    CHECKOUT_BTN = (By.LINK_TEXT, "Checkout")

    def go(self):
        return self.open("checkout/cart&language=en-gb")

    def is_empty(self) -> bool:
        return self.is_visible(self.EMPTY_MSG)

    def line_count(self) -> int:
        if self.is_present(self.ROWS):
            return len(self.find_all(self.ROWS))
        return 0

    def proceed_to_checkout(self):
        self.click(self.CHECKOUT_BTN)
        return self
