// Custom Cypress commands for OpenCart
Cypress.Commands.add("loginAsCustomer", (user) => {
  user = user || Cypress.env("customer");
  cy.visit("/index.php?route=account/login&language=en-gb");
  cy.get("#input-email").type(user.email);
  cy.get("#input-password").type(user.password, { log: false });
  cy.get("button[type=submit]").click();
  cy.url().should("include", "route=account/account");
});

Cypress.Commands.add("loginAsAdmin", () => {
  const a = Cypress.env("admin");
  cy.visit(Cypress.env("adminPath"));
  cy.get("#input-username").type(a.username);
  cy.get("#input-password").type(a.password, { log: false });
  cy.get("button[type=submit]").click();
  cy.url().should("include", "user_token=");
});

Cypress.Commands.add("addProductToCart", (productId) => {
  cy.visit(`/index.php?route=product/product&product_id=${productId}`);
  cy.get("#input-quantity").clear().type("1");
  cy.get("#button-cart").click();
  cy.get(".alert-success, #alert").should("be.visible");
});

Cypress.Commands.add("clearCart", () => {
  cy.request({ url: "/index.php?route=checkout/cart.remove", failOnStatusCode: false });
});
