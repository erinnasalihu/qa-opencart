from selenium.webdriver.common.by import By
from .base_page import BasePage


class WishlistPage(BasePage):
    ROWS  = (By.CSS_SELECTOR, "#wishlist-table tbody tr, table tbody tr")
    EMPTY = (By.XPATH, "//*[contains(., 'wish list is empty') or contains(., 'no items')]")

    def go(self):
        return self.open("account/wishlist&language=en-gb")
