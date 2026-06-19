describe("Wishlist requires login (TC-NAV-002)", () => {
  it("redirects anonymous user to /account/login", () => {
    cy.visit("/index.php?route=account/wishlist&language=en-gb");
    cy.url().should("match", /account\/(login|wishlist)/);
  });
});
