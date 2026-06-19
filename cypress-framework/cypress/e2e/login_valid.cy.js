import LoginPage from "../pages/LoginPage";

describe("Customer login — happy path (TC-AUTH-001)", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/index.php?route=account/login*").as("loginCall");
  });

  it("logs in a registered customer", () => {
    const user = Cypress.env("customer");
    LoginPage.visit().fillEmail(user.email).fillPassword(user.password).submit();
    cy.wait("@loginCall").its("response.statusCode").should("be.oneOf", [200, 302]);
    cy.location("href").should("include", "route=account/account");
    cy.contains("My Account").should("be.visible");
  });
});
