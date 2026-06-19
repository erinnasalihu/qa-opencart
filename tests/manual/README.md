# Manual test cases — 50 cards across 8 modules

| Module | Range | Count |
|---|---|---|
| Authentication | TC-AUTH-001..010 | 10 |
| Registration   | TC-REG-001..010  | 10 |
| Search         | TC-SEARCH-001..006 | 6 |
| Catalog        | TC-CAT-001..003 | 3 |
| Cart           | TC-CART-001..006 | 6 |
| Checkout       | TC-CHK-001..005 | 5 |
| Admin          | TC-ADMIN-001..005 | 5 |
| Nav/Responsive/Compat | TC-NAV/RESP/COMPAT-* | 5 |
| **Total**      | | **50** |

Techniques used:
- **Equivalence Partitioning** — email, password, telephone field classes
- **Boundary Value Analysis** — password length, cart quantity, pagination, firstname length
- **Decision Table** — checkout flows, coupon validity
- **State Transition** — order lifecycle, session lifecycle, account-lock states
- **Negative / Security** — XSS, SQLi, CVE regression checks

The CSV is the source of truth; import into Excel or Google Sheets to fill `Actual_Result` columns.
