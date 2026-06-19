from selenium.webdriver.common.by import By
from .base_page import BasePage


class LoginPage(BasePage):
    """Storefront /account/login.

    Selectors confirmed against OpenCart 4.1.x
    upload/catalog/view/template/account/login.twig — `#input-email` and
    `#input-password`.
    """
    EMAIL    = (By.ID, "input-email")
    PASSWORD = (By.ID, "input-password")
    SUBMIT   = (By.CSS_SELECTOR, "button[type='submit']")
    ALERT    = (By.CSS_SELECTOR, ".alert-danger, #alert .alert-danger, #account-login .alert-danger")
    FORGOT   = (By.PARTIAL_LINK_TEXT, "Forgotten Password")

    def go(self):
        return self.open("account/login&language=en-gb")

    def login(self, email: str, password: str):
        self.type(self.EMAIL, email)
        self.type(self.PASSWORD, password)
        self.click(self.SUBMIT)
        return self

    def error_text(self) -> str:
        return self.find(self.ALERT).text
