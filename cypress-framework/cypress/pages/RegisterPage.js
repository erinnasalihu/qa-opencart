class RegisterPage {
  static visit()         { cy.visit("/index.php?route=account/register&language=en-gb"); return this; }
  static fill({firstname, lastname, email, telephone, password}) {
    cy.get("#input-firstname").type(firstname);
    cy.get("#input-lastname").type(lastname);
    cy.get("#input-email").type(email);
    cy.get("#input-telephone").type(telephone);
    cy.get("#input-password").type(password, { log:false });
    return this;
  }
  static agree()  { cy.get("input[name=agree]").check({ force: true }); return this; }
  static submit() { cy.get("button[type=submit]").click(); return this; }
}
export default RegisterPage;
