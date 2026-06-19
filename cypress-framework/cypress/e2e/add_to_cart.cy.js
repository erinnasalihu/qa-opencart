import ProductPage from "../pages/ProductPage";

describe("Add to cart (TC-CART-001 / TC-CART-003)", () => {
  it("adds a product to cart and shows success toast", () => {
    const pid = Cypress.env("products").inStock;
    ProductPage.visit(pid).setQuantity(1).addToCart();
    ProductPage.successToast().should("be.visible");
  });

  it("BVA quantity values are handled", () => {
    const pid = Cypress.env("products").inStock;
    const values = [1, 2, 999];
    values.forEach(q => {
      ProductPage.visit(pid).setQuantity(q).addToCart();
      cy.get(".alert-success, .alert-danger").should("be.visible");
    });
  });
});
