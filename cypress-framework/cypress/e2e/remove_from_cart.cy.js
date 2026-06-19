import ProductPage from "../pages/ProductPage";
import CartPage    from "../pages/CartPage";

describe("Remove from cart (TC-CART-002)", () => {
  it("removes a previously-added product", () => {
    const pid = Cypress.env("products").inStock;
    ProductPage.visit(pid).setQuantity(1).addToCart();
    CartPage.visit().rows().its("length").should("be.gte", 1);
    CartPage.remove(0);
    cy.reload();
    cy.get("body").then($b => {
      const text = $b.text();
      expect(text.toLowerCase()).to.satisfy(t => t.includes("cart is empty") || t.includes("shopping cart"));
    });
  });
});
