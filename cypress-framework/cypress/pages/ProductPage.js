class ProductPage {
  static visit(id) { cy.visit(`/index.php?route=product/product&product_id=${id}`); return this; }
  static setQuantity(q) { cy.get("#input-quantity").clear().type(String(q)); return this; }
  static addToCart() { cy.get("#button-cart").click(); return this; }
  static successToast() { return cy.get(".alert-success, #alert .alert-success"); }
}
export default ProductPage;
