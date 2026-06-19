from selenium.webdriver.common.by import By
from .base_page import BasePage


class AccountPage(BasePage):
    H1            = (By.CSS_SELECTOR, "h1, h2")
    LOGOUT_LINK   = (By.LINK_TEXT, "Logout")
    EDIT_LINK     = (By.PARTIAL_LINK_TEXT, "Edit your account")

    def go(self):
        return self.open("account/account&language=en-gb")

    def logout(self):
        self.click(self.LOGOUT_LINK)
        return self
