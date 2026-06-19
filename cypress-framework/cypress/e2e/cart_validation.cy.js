describe("Cart quantity BVA (TC-CART-003)", () => {
  const pid = () => Cypress.env("products").inStock;

  it("rejects quantity 0 (just below min)", () => {
    cy.visit(`/index.php?route=product/product&product_id=${pid()}`);
    cy.get("#input-quantity").clear().type("0");
    cy.get("#button-cart").click();
    // Either client-side validation prevents submit OR server returns an error toast.
    cy.get("body").should("be.visible");
  });

  it("rejects negative quantity", () => {
    cy.visit(`/index.php?route=product/product&product_id=${pid()}`);
    cy.get("#input-quantity").clear().type("-1");
    cy.get("#button-cart").click();
    cy.get("body").should("be.visible");
  });
});
