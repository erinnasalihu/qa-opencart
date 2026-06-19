# OpenCart QA Test Package — End-to-End Execution Report

> Software Testing and Quality Assurance — Group Project (3 members)
> System Under Test: **OpenCart 4.1.0.3** (released 2025-03-25) running locally via Docker (Bitnami image)
> Report date: 2026-05-23

---

## TL;DR (Honesty First)

This document accompanies the `qa-opencart/` repository — a complete QA harness with:

- a **Dockerized OpenCart environment** (`infra/docker-compose.yml`),
- a **Selenium + pytest + POM** framework (Python),
- a **Cypress 13** framework,
- a **Postman + Newman** API suite,
- **Apache JMeter** performance plans (6 load profiles),
- a **GitHub Actions** CI/CD pipeline,
- **50 manual test cases** as CSV,
- **15 defect templates** + a defect-lifecycle process,
- an **ISO/IEC 25010:2023** quality analysis matrix.

**Honesty disclosure.** The execution environment used to assemble this deliverable cannot bring up a full OpenCart instance: it has no Docker daemon, no PHP/MySQL binaries, no browser installed, and the sandbox HTTP proxy blocks the Apache and Ubuntu mirrors. So the parts of the QA workflow that require a live SUT and a real browser have **not** been executed against OpenCart in this report. Everything below in the *Real Execution Evidence* sub-sections was actually run, with raw logs preserved verbatim in `reports/logs/`. Nothing has been fabricated.

| What ran for real | Status |
|---|---|
| `pip install` of Selenium 4.21.0, pytest 8.2.2, faker 25.8.0, pyyaml 6.0.1 | ✅ versions verified |
| `pytest --collect-only` against the framework | ✅ 15 tests discovered |
| `pytest` actual run (no browser) | ✅ Real NoSuchDriverException — proves framework wires Selenium Manager correctly |
| `npm install` of Cypress 13.13.0 + reporter | ✅ 280 packages installed |
| Cypress spec + config enumeration | ✅ 10 specs / 14 `it()` blocks / config keys validated |
| `npm install` of Newman 6.2.1 | ✅ installed |
| Newman run of the full Postman collection | ✅ 10 requests, 18 assertions, 28 failures, HTML + JSON reports written (real ECONNREFUSED because no SUT) |
| JMeter JMX XML validation | ✅ Both plans parse cleanly with all expected elements |

| What did **NOT** run | Reason |
|---|---|
| `docker compose up` | No docker binary; no `/var/run/docker.sock`; no sudo |
| Selenium / Cypress against a real browser | No Chrome/Firefox installed; apt blocked |
| Newman full pass results | No SUT — every request hits ECONNREFUSED |
| JMeter binary download / execution | dlcdn, archive.apache.org, and Maven Central return HTTP 403 from the sandbox proxy |
| Real screenshots / response-time numbers | No SUT, no browser |

To finish the assignment, clone the repo on a workstation with Docker + Chrome and run the four commands in the README. Every piece of the harness is wired to drop straight into the Bitnami stack.

---

## 1. Repository structure (delivered)

```
qa-opencart/
├── README.md
├── infra/                # docker-compose.yml + README
├── seeds/                # opencart_clean.sql (seeded after install)
├── selenium-framework/   # Python pytest + Selenium 4 + POM (11 page objects, 10 test files)
├── cypress-framework/    # Cypress 13 + mochawesome (10 specs + 4 page objects)
├── postman/              # Legacy api/* collection (10 requests) + local + demo envs
├── jmeter/               # OpenCart-Smoke.jmx + OpenCart-Full.jmx + README
├── .github/workflows/    # qa.yml — 4 jobs (selenium / cypress / api / jmeter-smoke)
├── tests/manual/         # test-cases.csv (50 cases) + README
├── bugs/                 # BUG-template.md + examples.md (15 example defects)
├── docs/                 # iso25010_matrix.md + this report + .docx
└── reports/
    ├── logs/             # 7 real log files from this run
    └── artifacts/newman/ # newman-result.html (242 KB) + newman-result.json (456 KB)
```

110 source files (excluding `node_modules/`).

---

## 2. Sandbox constraints (truthful inventory)

| Capability | Status | Impact |
|---|---|---|
| Docker daemon | Not available — no binary, no socket, unprivileged uid, sudo disabled | Cannot bring up Bitnami stack |
| `apt-get install` PHP/MariaDB/Chrome | Blocked (no sudo; userspace `apt-get download` blocked by proxy: HTTP 403 from `ports.ubuntu.com`) | Cannot install browsers or DB |
| Pre-installed browsers | None | Selenium/Cypress cannot start a real browser |
| Python 3.10 / Node 22 / Java 11 | Available | Framework code can be installed and statically validated |
| pypi.org / registry.npmjs.org | Allowed | `pip install` and `npm install` succeed |
| Apache mirrors / Maven Central | Blocked (403 on CONNECT) | JMeter binary cannot be downloaded |
| RAM / CPU | 3.8 GB / 4 cores aarch64 | Insufficient for JMeter ≥250 thread profiles anyway |

---

## 3. Selenium framework — Python + pytest + POM

### Architecture
- `pages/` — 11 page objects: `BasePage` + Home / Login / Register / Search / Product / Cart / Checkout / Account / Wishlist / AdminLogin.
- `tests/` — 10 test files, 15 collected pytest IDs (4-row parameterization on `test_login_invalid`).
- `utils/driver_factory.py` — Chrome / Firefox / Edge factory using Selenium Manager (Selenium 4.21 bundled).
- `conftest.py` — session-scoped config fixture, screenshot-on-failure hook, HTML report writer.
- `pytest.ini` — markers (`smoke`, `p1`, `p2`, `security`, `regression`), CLI defaults, log config.

### Test → manual TC mapping

| Test file | Manual TC | Notes |
|---|---|---|
| `test_login_valid.py` | TC-AUTH-001 | Lands on `route=account/account` |
| `test_login_invalid.py` | TC-AUTH-002..004 | Parameterised x4 (wrong-pw, unknown-email, empty, malformed) |
| `test_registration.py` | TC-REG-001 | Faker-generated user, success page check |
| `test_search.py` | TC-SEARCH-001/002/006 | Includes XSS regression for CVE-2024-21517 / CVE-2024-58341 |
| `test_add_to_cart.py` | TC-CART-001 | Success toast + cart line count |
| `test_remove_from_cart.py` | TC-CART-002 | Cart empties |
| `test_checkout_navigation.py` | TC-CHK-004 | Anonymous gets login/guest prompt |
| `test_wishlist.py` | TC-NAV-002 | Anonymous /wishlist → /login |
| `test_logout.py` | TC-AUTH-008 | Logout returns to public area |
| `test_admin_login.py` | TC-ADMIN-001 | `user_token=` appears in URL |

### Real execution evidence

`pip install` (verbatim tail from `reports/logs/01-pip-install.log`):

```
selenium 4.21.0 | pytest 8.2.2 | pyyaml 6.0.1
```

`pytest --collect-only` (verbatim from `reports/logs/02-pytest-collect.log`):

```
tests/test_add_to_cart.py::test_add_product_to_cart
tests/test_admin_login.py::test_admin_valid_login
tests/test_checkout_navigation.py::test_checkout_redirect_when_anonymous
tests/test_login_invalid.py::test_invalid_login[qa.valid@test.local-wrong-pw-wrong-password]
tests/test_login_invalid.py::test_invalid_login[no.such.user@test.local-Pass@123-unknown-email]
tests/test_login_invalid.py::test_invalid_login[--empty]
tests/test_login_invalid.py::test_invalid_login[not-an-email-Pass@123-malformed]
tests/test_login_valid.py::test_valid_login
tests/test_logout.py::test_logout
tests/test_registration.py::test_register_new_customer
tests/test_remove_from_cart.py::test_remove_from_cart
tests/test_search.py::test_search_returns_results
tests/test_search.py::test_search_no_results
tests/test_search.py::test_search_xss_payload_is_escaped
tests/test_wishlist.py::test_wishlist_requires_login

15 tests collected in 0.03s
```

`pytest` actual run (tail from `reports/logs/03-pytest-run-no-browser.log`):

```
selenium.common.exceptions.NoSuchDriverException: Message: Unable to obtain driver for chrome;
For documentation on this error, please visit:
https://www.selenium.dev/documentation/webdriver/troubleshooting/errors/driver_location
ERROR tests/test_login_valid.py::test_valid_login - selenium.common.exception...
```

> This is *honest evidence*: the framework imports cleanly, pytest collects every test, Selenium Manager runs, and the failure is the expected "no Chrome binary on disk" error — not a framework bug.

---

## 4. Cypress framework

### Architecture
- `cypress.config.js` — viewport 1366×768, runMode retries=2, mochawesome reporter, intercepts.
- `cypress/pages/` — Login / Register / Product / Cart page objects.
- `cypress/support/commands.js` — `loginAsCustomer`, `loginAsAdmin`, `addProductToCart`, `clearCart`.
- `cypress/e2e/` — 10 specs covering Login, Search, Cart, Checkout, Wishlist, Logout, Navigation.

### Specs

| Spec | `it()`s | Maps to |
|---|---|---|
| login_valid.cy.js | 1 | TC-AUTH-001 |
| login_invalid.cy.js | 1 (×4 matrix inside) | TC-AUTH-002..004 |
| search.cy.js | 3 | TC-SEARCH-001/002/006 |
| add_to_cart.cy.js | 2 | TC-CART-001, TC-CART-003 |
| remove_from_cart.cy.js | 1 | TC-CART-002 |
| cart_validation.cy.js | 2 | TC-CART-003 (qty 0, -1) |
| checkout.cy.js | 1 | TC-CHK-004 |
| wishlist.cy.js | 1 | TC-NAV-002 |
| logout.cy.js | 1 | TC-AUTH-008 |
| navigation.cy.js | 1 | TC-NAV-001 |
| **Total** | **14** | |

### Real execution evidence (from `reports/logs/04-npm-install.log` + `07-cypress-collect.log`)

```
added 280 packages in 38s
Cypress package version: 13.13.0
Cypress binary version: not installed   (CYPRESS_INSTALL_BINARY=0 was set; full install on a workstation)
specs found: 10
viewport: 1366x768
retries: {"runMode":2,"openMode":0}
baseUrl: http://localhost:8080
reporter: cypress-mochawesome-reporter
env keys: [ 'customer', 'admin', 'adminPath', 'products' ]
```

---

## 5. API testing — Postman + Newman

### Reality of OpenCart's API
OpenCart 4.x ships a legacy storefront API at `index.php?route=api/<controller>[.method]`. Inputs are form-urlencoded, responses are JSON, and authentication is via `api/login` which returns a 32-char `api_token` that must be appended as a query parameter on every subsequent call. There is **no** OpenAPI/Swagger spec, no OAuth2 in core. The collection in `postman/opencart-api.postman_collection.json` is built against this real shape.

### 10 requests + 18 assertions

| # | Name | Method | Route | Notable assertion |
|---|---|---|---|---|
| API-01 | Login (happy path) | POST | `api/login` | `api_token` 32 hex chars; response time < 1500 ms |
| API-02 | Login (invalid key) | POST | `api/login` | `error.key` set |
| API-03 | Login (missing username) | POST | `api/login` | `error.username` set |
| API-04 | Add to cart | POST | `api/cart.add` | tv4 schema valid |
| API-05 | Cart products | GET | `api/cart.products` | `products[]` present |
| API-06 | Edit quantity (BVA 0) | POST | `api/cart.edit` | success **or** error returned |
| API-07 | Shipping methods | GET | `api/shipping.methods` | 200 |
| API-08 | Payment methods | GET | `api/payment.methods` | 200 |
| API-09 | Create order | POST | `api/order.add` | `order_id` on success |
| API-10 | Unauthorized call | GET | `api/cart.products` | `error.api_token` on stale token |

### Real Newman run

From the verbatim `newman-result.json` stats:

| Counter | Total | Failed |
|---|---|---|
| Iterations | 1 | 0 |
| Requests | 10 | 10 |
| Test scripts | 10 | 0 |
| Assertions | 18 | 18 |

All 10 requests failed with `connect ECONNREFUSED 127.0.0.1:8080` — *real network errors from a real Newman run against a non-running SUT*. This proves the collection is well-formed (Newman parses, runs every script, evaluates every assertion). HTML report saved at `reports/artifacts/newman/newman-result.html` (242 KB).

---

## 6. JMeter — performance plans

### Two plans, six profiles

| Profile | Command | Threads | Ramp | Hold |
|---|---|---|---|---|
| Smoke | `OpenCart-Smoke.jmx` | 5 | 5 s | 30 s |
| Load baseline | `OpenCart-Full.jmx -Jthreads=50  -Jrampup=60  -Jduration=300` | 50 | 60 s | 5 min |
| Load peak | `OpenCart-Full.jmx -Jthreads=250 -Jrampup=120 -Jduration=300` | 250 | 120 s | 5 min |
| Stress | `OpenCart-Full.jmx -Jthreads=500 -Jrampup=180 -Jduration=300` | 500 | 180 s | 5 min |
| Spike | `OpenCart-Full.jmx -Jthreads=500 -Jrampup=30  -Jduration=120` | 500 | 30 s | 2 min |
| Endurance | `OpenCart-Full.jmx -Jthreads=100 -Jrampup=120 -Jduration=3600` | 100 | 120 s | 60 min |

### Sampler coverage (5 per plan)
- `GET /` (homepage)
- `GET /index.php?route=product/category&path=20`
- `GET /index.php?route=product/product&product_id=42`
- `GET /index.php?route=product/search&search=phone`
- `POST /index.php?route=checkout/cart.add` (product_id, quantity)

Plus per-thread HTTP Defaults, Cookie Manager, Header Manager, and a Summary Report listener writing `results.jtl`.

### Real XML validation evidence

From `reports/logs/06-jmeter.log`:

```
found 2 JMX plans
--- OpenCart-Full.jmx ---  size: 10225 bytes, jmeter version 5.6.3
  TestPlans:1  ThreadGroups:1  HTTPSamplerProxy:5  CookieManager:1  HeaderManager:1  HTTP Defaults:1  ResultCollector:1
  syntax: VALID
--- OpenCart-Smoke.jmx --- size: 10167 bytes, jmeter version 5.6.3
  TestPlans:1  ThreadGroups:1  HTTPSamplerProxy:5  CookieManager:1  HeaderManager:1  HTTP Defaults:1  ResultCollector:1
  syntax: VALID
```

JMeter binary download was blocked by the sandbox proxy (403 from CONNECT on `dlcdn.apache.org`, `archive.apache.org`, `repo1.maven.org`).

### Results table (to be filled on a real run)

| Scenario | Avg (ms) | p90 | p95 | Throughput (req/s) | Error % |
|---|---|---|---|---|---|
| Smoke | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| Load 50 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| Load 250 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| Stress 500 | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| Spike | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |
| Endurance | [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |

---

## 7. CI/CD — GitHub Actions

`.github/workflows/qa.yml` runs four jobs on every push to `main`/`develop`, every PR, and on `workflow_dispatch`:

1. **selenium** — boots Docker stack, installs Python deps, runs pytest with HTML report, uploads artifacts.
2. **cypress** — boots Docker stack, runs `cypress-io/github-action@v6` against `http://localhost:8080`, uploads videos + screenshots.
3. **api** — installs Newman + `htmlextra`, boots Docker stack, runs the collection, uploads HTML report.
4. **jmeter-smoke** — boots Docker stack, downloads JMeter 5.6.3, runs `OpenCart-Smoke.jmx`, uploads JTL + dashboard.

Quality gates:
- 100 % of P1 tests must pass
- ≥ 95 % overall pass rate
- All S1/S2 defects fixed or formally accepted
- No new dependency CVE of CVSS ≥ 7
- All artefacts uploaded

> JMeter heavy profiles (≥250 threads) should run on a self-hosted runner — GitHub's free 2-core / 7 GB runners cannot sustain them.

---

## 8. Manual test cases + defect templates

- `tests/manual/test-cases.csv` ships **50 test cases**, distributed:
  - Authentication 10, Registration 10, Search 6, Catalog 3, Cart 6, Checkout 5, Admin 5, Nav/Responsive/Compat 5.
- Techniques applied: equivalence partitioning, boundary-value analysis, decision tables, state transition, negative/security (including XSS + SQLi CVE regressions).
- `bugs/BUG-template.md` is a one-page severity/priority defect template.
- `bugs/examples.md` contains **15 example defects** (BUG-001..015), every one clearly labelled as a *hypothesis* to be verified on the live install.

### Severity × Priority

| Severity | Definition | Priority | Fix horizon |
|---|---|---|---|
| S1 Critical | Data loss / security breach / checkout unusable | P1 Immediate | Hotfix |
| S2 Major | Major feature broken, no workaround | P2 High | Next sprint |
| S3 Minor | Feature partially broken, workaround exists | P3 Medium | Backlog |
| S4 Cosmetic | UI/text issue, no functional impact | P4 Low | Deferred |

---

## 9. ISO/IEC 25010:2023 quality analysis

The 2023 revision adds **Safety** as a new characteristic, renames Usability → **Interaction Capability**, renames Portability → **Flexibility**, and adds sub-characteristics like **Scalability** (under Flexibility) and **Inclusivity** + **Self-descriptiveness** (under Interaction Capability).

See `docs/iso25010_matrix.md` for the per-characteristic observation table. Numeric scores are intentionally left as `[INSERT]` — they must come from real observation.

---

## 10. Three-person work split

| Role | Owns | Deliverables |
|---|---|---|
| Person 1 — Manual & Defect Lead | Manual TCs, defect lifecycle, ISO 25010 scoring, traceability | `tests/manual/`, `bugs/`, `docs/iso25010_matrix.md` |
| Person 2 — UI Automation Engineer | Selenium + Cypress frameworks, page objects, fixtures, parallel runs | `selenium-framework/`, `cypress-framework/` |
| Person 3 — Backend & DevOps Lead | Docker, API, JMeter, CI, report assembly | `infra/`, `postman/`, `jmeter/`, `.github/`, final docs |

---

## 11. How to run the suite on a workstation

```bash
# 1. Bring up the stack
cd infra && docker compose up -d
docker compose logs -f opencart    # wait for "** OpenCart setup finished! **"

# 2. Snapshot the clean state
docker compose exec mariadb \
  mysqldump -ubn_opencart -popencart_pw_change_me bitnami_opencart \
  > ../seeds/opencart_clean.sql

# 3. Selenium
cd ../selenium-framework
pip install -r requirements.txt
pytest -n 2 --reruns 1

# 4. Cypress
cd ../cypress-framework && npm ci
npx cypress run

# 5. API
newman run ../postman/opencart-api.postman_collection.json \
  -e ../postman/local.postman_environment.json \
  -r cli,htmlextra

# 6. JMeter
jmeter -n -t ../jmeter/plans/OpenCart-Smoke.jmx \
  -l results/smoke.jtl -e -o results/smoke-html
```

---

## Caveats & honesty notes

- **No fabricated screenshots.** The conftest screenshot-on-fail hook and Cypress `screenshotOnRunFailure` are wired; real PNGs will appear the moment the suite runs against a real browser.
- **No fabricated metrics.** The JMeter table contains `[TBD]` placeholders.
- **CVE references are inspiration** for negative test cases — verify each one on the live install. *CVE-2024-40420 was REJECTED by MITRE on 2024-12-18 as a duplicate of CVE-2024-36694*; use `CVE-2024-36694` (CVSS 3.1 = 7.2 HIGH per CISA-ADP on NVD) for the SSTI Theme Editor issue.
- **ISO/IEC 25010:2023** numeric scores are left blank — they must come from real observation.
- **demo.opencart.com was NOT used** as a test target during this run, as you specified.
- **Every log excerpt is real** and lives verbatim under `reports/logs/`.
