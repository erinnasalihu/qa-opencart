describe("Search (TC-SEARCH-001..006)", () => {
  it("returns results for a known product", () => {
    cy.visit("/index.php?route=product/search&search=iPhone");
    cy.get(".product-thumb, .product-layout").its("length").should("be.gte", 1);
  });
  it("shows the 'no products' message when nothing matches", () => {
    cy.visit("/index.php?route=product/search&search=nonexistentXYZ123");
    cy.contains(/no products/i).should("be.visible");
  });
  it("escapes XSS payloads in the query string", () => {
    const payload = "<script>alert(1)</script>";
    cy.visit(`/index.php?route=product/search&search=${encodeURIComponent(payload)}`);
    cy.get("body").then($b => {
      expect($b.html().toLowerCase()).not.to.match(/<script>alert\(1\)<\/script>/);
    });
  });
});
