require("./commands");
require("cypress-mochawesome-reporter/register");

// Suppress uncaught exceptions from third-party scripts in OpenCart's
// default theme (e.g., legacy jQuery plugins).
Cypress.on("uncaught:exception", () => false);
