class CartPage {
  static visit() { cy.visit("/index.php?route=checkout/cart&language=en-gb"); return this; }
  static rows() { return cy.get("#cart table tbody tr, .table-bordered tbody tr"); }
  static remove(idx = 0) { cy.get("button[aria-label=Remove], .fa-times").eq(idx).click(); return this; }
  static emptyMsg() { return cy.contains("cart is empty"); }
}
export default CartPage;
