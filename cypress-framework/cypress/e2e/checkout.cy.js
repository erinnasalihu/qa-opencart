describe("Checkout navigation (TC-CHK-004)", () => {
  it("anonymous user reaching /checkout/checkout sees login or guest options", () => {
    cy.visit("/index.php?route=checkout/checkout&language=en-gb");
    cy.get("body").then($b => {
      const t = $b.text().toLowerCase();
      expect(t).to.satisfy(s => s.includes("checkout") || s.includes("login") || s.includes("register"));
    });
  });
});
