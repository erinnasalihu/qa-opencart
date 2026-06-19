from selenium.webdriver.common.by import By
from .base_page import BasePage


class RegisterPage(BasePage):
    FIRSTNAME  = (By.ID, "input-firstname")
    LASTNAME   = (By.ID, "input-lastname")
    EMAIL      = (By.ID, "input-email")
    TELEPHONE  = (By.ID, "input-telephone")
    PASSWORD   = (By.ID, "input-password")
    AGREE      = (By.CSS_SELECTOR, "input[name='agree']")
    SUBMIT     = (By.CSS_SELECTOR, "button[type='submit']")
    SUCCESS_H  = (By.CSS_SELECTOR, "h1")  # "Your Account Has Been Created!"
    ALERT      = (By.CSS_SELECTOR, ".alert-danger, .text-danger")

    def go(self):
        return self.open("account/register&language=en-gb")

    def register(self, firstname, lastname, email, telephone, password, agree=True):
        self.type(self.FIRSTNAME, firstname)
        self.type(self.LASTNAME,  lastname)
        self.type(self.EMAIL,     email)
        self.type(self.TELEPHONE, telephone)
        self.type(self.PASSWORD,  password)
        if agree:
            self.click(self.AGREE)
        self.click(self.SUBMIT)
        return self

    def success_visible(self) -> bool:
        return self.is_visible(self.SUCCESS_H) and "Created" in self.text_of(self.SUCCESS_H)
