class LoginPage {
  static visit() {
    cy.visit("/index.php?route=account/login&language=en-gb");
    return this;
  }
  static fillEmail(v)    { cy.get("#input-email").clear().type(v); return this; }
  static fillPassword(v) { cy.get("#input-password").clear().type(v, { log: false }); return this; }
  static submit()        { cy.get("button[type=submit]").click(); return this; }
  static errorText()     { return cy.get(".alert-danger, #alert .alert-danger"); }
}
export default LoginPage;
