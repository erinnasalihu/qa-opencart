describe("Top navigation (TC-NAV-001)", () => {
  it("the storefront home loads with menu and search bar", () => {
    cy.visit("/");
    cy.get("input[name=search]").should("be.visible");
    cy.get("#header-cart, #cart-total").should("be.visible");
  });
});
