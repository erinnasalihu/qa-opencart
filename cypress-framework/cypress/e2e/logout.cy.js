describe("Logout (TC-AUTH-008)", () => {
  it("logs the user out and lands on a public page", () => {
    cy.loginAsCustomer();
    cy.visit("/index.php?route=account/account&language=en-gb");
    cy.contains("Logout").click();
    cy.url().should("match", /account\/logout|common\/home/);
  });
});
