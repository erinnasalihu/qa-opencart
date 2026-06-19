from selenium.webdriver.common.by import By
from .base_page import BasePage


class HomePage(BasePage):
    SEARCH_INPUT  = (By.NAME, "search")
    SEARCH_BUTTON = (By.CSS_SELECTOR, "#search button, .input-group-btn button")
    CART_BUTTON   = (By.CSS_SELECTOR, "#header-cart a, #cart-total")
    MY_ACCOUNT    = (By.CSS_SELECTOR, "a[title='My Account']")

    def go(self):
        return self.open("")

    def search(self, term: str):
        self.type(self.SEARCH_INPUT, term)
        self.click(self.SEARCH_BUTTON)
        return self
