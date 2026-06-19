# 15 example defects (HYPOTHESES — verify on your OpenCart 4.1.x install)

> Each card uses the same template as `BUG-template.md`. "Actual Result" and "Evidence"
> are intentionally left as `[INSERT]` because they must come from real execution.

| ID | Title | Sev | Prio | Rationale |
|---|---|---|---|---|
| BUG-001 | "Add to cart" success toast persists after route change | S4 | P3 | OpenCart's #alert div is not cleared on history.pushState |
| BUG-002 | Cart total in header not refreshed until full page reload | S2 | P2 | Known AJAX/cache mismatch from 3.x — verify on 4.1.x |
| BUG-003 | Quantity field accepts 0 and silently removes line — no confirm | S3 | P2 | UX gap |
| BUG-004 | Password reset email contains absolute URL with http:// even on HTTPS site | S2 | P2 | SERVER_PROTOCOL misconfiguration |
| BUG-005 | Reflected XSS via redirect param on /account/login (CVE-2024-21517 regression) | S1 | P1 | Patched in 4.1.0 — verify |
| BUG-006 | Search query `' OR 1=1 -- ` returns full catalog (CVE-2024-58341 regression) | S1 | P1 | Verify input sanitization on product/search |
| BUG-007 | Mobile 360px — product image overflows on category page | S3 | P3 | Default Bootstrap grid issue |
| BUG-008 | Pagination — Last page link shows empty page when only 1 result | S3 | P3 | URL-parameter edge case |
| BUG-009 | Order confirmation email references wrong currency when store currency changed mid-session | S2 | P2 | Session/currency synchronization |
| BUG-010 | Admin → Catalog → Product save fails silently when SEO URL contains spaces | S2 | P2 | Validation only on client side |
| BUG-011 | Logout link visible to anonymous users on certain redirects | S4 | P4 | Template-rendering condition |
| BUG-012 | Wishlist counter persists after deleting all items until next page load | S3 | P3 | AJAX-update gap |
| BUG-013 | Filter "Price" range slider accepts negative values | S3 | P3 | Client-side validation missing |
| BUG-014 | Admin backup arbitrary-file-creation (CVE-2024-21519 regression) | S1 | P1 | Re-test after patch |
| BUG-015 | Session ID is not rotated after login (session-fixation risk) | S2 | P2 | OWASP A07; verify cookie change |
