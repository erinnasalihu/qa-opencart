import LoginPage from "../pages/LoginPage";

describe("Customer login — invalid credentials (TC-AUTH-002..004)", () => {
  const matrix = [
    { case: "wrong password",    email: "qa.valid@test.local",       password: "wrong-pw" },
    { case: "unknown email",     email: "no.such.user@test.local",   password: "Pass@123" },
    { case: "empty fields",      email: "",                          password: "" },
    { case: "malformed email",   email: "not-an-email",              password: "Pass@123" }
  ];
  matrix.forEach(({ case: c, email, password }) => {
    it(`rejects ${c}`, () => {
      LoginPage.visit();
      if (email)    cy.get("#input-email").type(email);
      if (password) cy.get("#input-password").type(password, { log: false });
      cy.get("button[type=submit]").click();
      cy.get(".alert-danger, .alert-warning, #alert .alert-danger")
        .should("be.visible")
        .invoke("text")
        .should("match", /No match|Warning|exceeded|Required/i);
    });
  });
});
