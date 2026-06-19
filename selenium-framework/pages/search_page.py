from selenium.webdriver.common.by import By
from .base_page import BasePage


class SearchPage(BasePage):
    INPUT      = (By.ID, "input-search")
    BUTTON     = (By.ID, "button-search")
    RESULTS    = (By.CSS_SELECTOR, ".product-thumb, .product-layout")
    NO_RESULTS = (By.XPATH, "//*[contains(translate(., 'NO', 'no'), 'no products')]")

    def go(self):
        return self.open("product/search&language=en-gb")

    def search(self, term: str):
        self.type(self.INPUT, term)
        self.click(self.BUTTON)
        return self

    def result_count(self) -> int:
        if self.is_present(self.RESULTS):
            return len(self.find_all(self.RESULTS))
        return 0
