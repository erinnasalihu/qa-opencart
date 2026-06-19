from selenium.webdriver.common.by import By
from .base_page import BasePage


class CheckoutPage(BasePage):
    H1            = (By.CSS_SELECTOR, "h1")
    LOGIN_OPT     = (By.CSS_SELECTOR, "input[name='account'][value='register']")
    GUEST_OPT     = (By.CSS_SELECTOR, "input[name='account'][value='guest']")
    CONTINUE      = (By.ID, "button-account")
    CONFIRM_ORDER = (By.ID, "button-confirm")
    SUCCESS_H1    = (By.XPATH, "//h1[contains(., 'Order has been placed')]")

    def go(self):
        return self.open("checkout/checkout&language=en-gb")
