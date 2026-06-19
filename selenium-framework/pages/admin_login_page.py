from selenium.webdriver.common.by import By
from .base_page import BasePage


class AdminLoginPage(BasePage):
    """OpenCart admin panel — /administration on Bitnami, /admin upstream.

    Selectors verified against upload/admin/view/template/common/login.twig
    (`#input-username`, `#input-password`).
    """
    USERNAME = (By.ID, "input-username")
    PASSWORD = (By.ID, "input-password")
    SUBMIT   = (By.CSS_SELECTOR, "button[type='submit']")
    ALERT    = (By.CSS_SELECTOR, ".alert-danger")

    def __init__(self, driver, base_url, admin_path="/administration"):
        super().__init__(driver, base_url)
        self.admin_path = admin_path

    def go(self):
        self.driver.get(self.base_url + self.admin_path)
        return self

    def login(self, username, password):
        self.type(self.USERNAME, username)
        self.type(self.PASSWORD, password)
        self.click(self.SUBMIT)
        return self
