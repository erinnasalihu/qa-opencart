const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, PageOrientation, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, ExternalHyperlink,
  TabStopType, TabStopPosition, PageBreak, PageNumber, Header, Footer
} = require("docx");

// Shared style/colour constants
const FONT = "Arial";
const BLACK = "000000";
const GREY  = "555555";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const HEAD_FILL = "DDE6EE";
const CELL_M = { top: 80, bottom: 80, left: 120, right: 120 };
const ALL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER, insideHorizontal: BORDER, insideVertical: BORDER };

// US Letter w/ 1" margins, content width 9360 DXA
const CONTENT_W = 9360;

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120 },
    alignment: opts.align,
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, color: opts.color, size: opts.size, font: FONT })]
  });
}
function pRuns(runs, opts = {}) {
  return new Paragraph({ spacing: { after: opts.after ?? 120 }, alignment: opts.align, children: runs });
}
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, bold: true, font: FONT })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text, bold: true, font: FONT })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 100 }, children: [new TextRun({ text, bold: true, font: FONT })] }); }
function code(text) {
  // Render code/log lines as monospace paragraphs
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Courier New", size: 18 })]
  });
}
function bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text, font: FONT })] });
}
function bulletRuns(runs) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: runs });
}
function num(text) {
  return new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun({ text, font: FONT })] });
}

function cell(text, opts = {}) {
  const widths = opts.widths;
  return new TableCell({
    width: { size: widths, type: WidthType.DXA },
    borders: ALL_BORDERS,
    margins: CELL_M,
    shading: opts.head ? { fill: HEAD_FILL, type: ShadingType.CLEAR } : undefined,
    verticalAlign: "center",
    children: (Array.isArray(text) ? text : [text]).map(t =>
      new Paragraph({ alignment: opts.align, children: [new TextRun({ text: String(t), bold: opts.bold || opts.head, font: FONT, size: opts.size })] })
    )
  });
}

function makeTable(headRow, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const head = new TableRow({
    tableHeader: true,
    children: headRow.map((t, i) => cell(t, { widths: colWidths[i], head: true }))
  });
  const body = rows.map(r => new TableRow({
    children: r.map((t, i) => cell(t, { widths: colWidths[i] }))
  }));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [head, ...body]
  });
}

// --- read real log content for the appendix ---
const LOG = (rel) => fs.readFileSync(path.join(__dirname, "..", "reports", "logs", rel), "utf8");
const truncate = (s, n=60) => s.split("\n").slice(0, n).join("\n");

const PIP_LOG     = truncate(LOG("01-pip-install.log"), 80);
const COLLECT_LOG = truncate(LOG("02-pytest-collect.log"), 80);
const NOBROWSER   = truncate(LOG("03-pytest-run-no-browser.log"), 60);
const NPM_LOG     = truncate(LOG("04-npm-install.log"), 60);
const NEWMAN_LOG  = truncate(LOG("05-newman.log"), 80);
const JMETER_LOG  = truncate(LOG("06-jmeter.log"), 80);
const CYPRESS_LOG = truncate(LOG("07-cypress-collect.log"), 40);

// --- read the JSON summary from newman for the api section ---
const newmanJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "reports", "artifacts", "newman", "newman-result.json"), "utf8"));
const nStats = newmanJson.run.stats;

const doc = new Document({
  creator: "QA Team",
  title: "OpenCart QA Test Package — Execution Report",
  description: "End-to-end QA harness for OpenCart 4.1.x — real sandbox execution evidence",
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } }, // 11pt default
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, font: FONT, color: BLACK },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: BLACK },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: BLACK },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "OpenCart QA — Execution Report", italics: true, color: GREY, font: FONT, size: 18 })]
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", font: FONT, size: 18, color: GREY }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: GREY })
          ]
        })
      ]})
    },
    children: [
      // ======== COVER ========
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 240 },
        children: [new TextRun({ text: "OpenCart QA Test Package", bold: true, size: 56, font: FONT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
        children: [new TextRun({ text: "End-to-End QA Harness — Execution Report", size: 32, font: FONT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 },
        children: [new TextRun({ text: "Software Testing and Quality Assurance — Group Project (3 members)", italics: true, color: GREY, font: FONT, size: 22 })] }),
      makeTable(
        ["Field", "Value"],
        [
          ["System Under Test", "OpenCart 4.1.0.3 (released 2025-03-25) — Bitnami Docker image"],
          ["Storefront URL (intended)", "http://localhost:8080"],
          ["Admin URL (intended)", "http://localhost:8080/administration"],
          ["Report date", new Date().toISOString().slice(0, 10)],
          ["Frameworks used", "pytest + Selenium 4.21.0 (POM); Cypress 13.13.0; Newman 6.2.1; JMeter 5.6.3 plan; GitHub Actions"],
          ["Quality model", "ISO/IEC 25010:2023 (9 characteristics)"],
        ],
        [3000, 6360]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ======== EXECUTIVE SUMMARY ========
      h1("Executive Summary"),
      p("This document accompanies the qa-opencart/ repository — a complete QA harness for OpenCart 4.1.x consisting of (a) a Dockerized OpenCart environment, (b) a Selenium 4 + pytest + Page Object Model framework, (c) a Cypress 13 framework, (d) a Postman/Newman API suite, (e) Apache JMeter performance plans, (f) a GitHub Actions CI/CD pipeline, (g) 50 manual test cases, (h) 15 defect templates, and (i) an ISO/IEC 25010:2023 quality analysis matrix."),
      p("Honesty disclosure (critical). The execution environment used to assemble this deliverable could not bring up an OpenCart instance: Docker is not available, the system has no PHP/MariaDB binaries, no browser is installed, and the sandbox HTTP proxy blocks all Apache mirrors and Ubuntu archives. Therefore the parts of the QA workflow that require a live SUT and a real browser have NOT been executed against OpenCart in this report. Every output in the Real Execution Evidence section was actually run and the raw logs are reproduced verbatim; nothing has been fabricated."),
      p("What WAS executed in this sandbox (real outputs):"),
      bullet("Dependency installs (pip install selenium / pytest / faker / pyyaml; npm install cypress; npm install newman) — all packages installed successfully with verifiable versions."),
      bullet("pytest --collect-only discovered 15 test cases across the 10 test files."),
      bullet("A pytest run against the framework produced the expected NoSuchDriverException — proof that the framework code is wired up correctly even though no Chrome is available."),
      bullet("Newman 6.2.1 parsed and executed the entire 10-request Postman collection against the unreachable localhost:8080, producing an authentic 242 KB HTML report and 456 KB JSON result."),
      bullet("Cypress 13.13.0 package and config were validated; 10 specs containing 14 it() blocks were enumerated."),
      bullet("Both JMeter JMX plans were XML-validated and structurally inspected (TestPlan, ThreadGroup, 5 HTTPSamplerProxy, CookieManager, HeaderManager, HTTP Defaults, ResultCollector)."),
      p("What was NOT executed and why:"),
      bullet("Docker compose up — no docker binary; no /var/run/docker.sock; unprivileged user; sudo disabled."),
      bullet("Selenium test runs against a real browser — no Chrome/Firefox installed, apt blocked, no proxy allowlist for Ubuntu archives."),
      bullet("Cypress run against the SUT — same browser blocker, plus no SUT."),
      bullet("Full Newman pass/fail evidence — every request returns ECONNREFUSED 127.0.0.1:8080 because no SUT is running."),
      bullet("JMeter load runs — Apache mirrors and Maven Central are blocked by the sandbox proxy (HTTP 403 on CONNECT). The JMX plan itself was XML-validated."),
      p("Conclusion. The deliverable in this report is the full repository (qa-opencart/) plus the verifiable real-execution evidence captured during this run. To complete the assignment, the team must clone the repository on a developer workstation with Docker + Chrome and run the four commands listed in the README; each piece of the harness has been written to run unmodified against the Bitnami OpenCart stack."),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== SECTION 1: REPOSITORY STRUCTURE ========
      h1("1. Repository Structure (delivered)"),
      p("The harness is laid out as a single repository with one folder per discipline. All paths in the table below are real and were created during this session."),
      makeTable(
        ["Folder", "Contents", "Status"],
        [
          ["infra/", "docker-compose.yml (bitnami/opencart:4 + mariadb:11 + phpmyadmin + mailhog), README", "Written — needs Docker host to execute"],
          ["selenium-framework/", "Python pytest + Selenium 4.21 + POM (11 page objects, 10 test files, conftest, driver factory, utils, fixtures)", "Written and exercised in this sandbox"],
          ["cypress-framework/", "Cypress 13.13 + mochawesome reporter + 10 specs + 4 page objects + custom commands", "Written and exercised in this sandbox"],
          ["postman/", "OpenCart legacy api/* collection (10 requests + Tests-tab assertions) + local & demo envs", "Written and executed end-to-end via Newman"],
          ["jmeter/", "Smoke + Full JMX plans, parameterized via -J properties (6 load profiles)", "Plans written; XML-validated"],
          [".github/workflows/qa.yml", "Four GitHub Actions jobs (Selenium, Cypress, Newman, JMeter smoke)", "Written — runs on push/PR in any GitHub repo"],
          ["tests/manual/", "50 manual test cases as CSV (importable into Excel/Google Sheets) + README", "Written"],
          ["bugs/", "Defect template + 15 example defect cards (hypotheses, mapped to OWASP / CVE inspiration)", "Written"],
          ["docs/", "ISO/IEC 25010:2023 matrix + this report (Markdown + Word)", "Written"],
          ["reports/", "Real-execution logs and artefacts from THIS sandbox run (Newman HTML, JSON, pytest logs)", "Real outputs"],
        ],
        [2200, 5500, 1660]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ======== SECTION 2: SANDBOX CONSTRAINTS ========
      h1("2. Sandbox Constraints (truthful inventory)"),
      p("The execution environment used for this session has the following inventory, probed at the start of the run. These constraints are why some workflow steps could not be run end-to-end in this sandbox."),
      makeTable(
        ["Capability", "Status", "Impact on execution"],
        [
          ["Docker daemon", "Not available — no docker binary, no /var/run/docker.sock, unprivileged uid 1004, sudo disabled", "Cannot bring up the Bitnami OpenCart stack"],
          ["apt-get install (PHP / MariaDB / Chrome / Firefox)", "Blocked — sudo refused, sources.list cannot be modified; userspace apt-get download blocked by proxy (HTTP 403 from ports.ubuntu.com)", "Cannot install PHP/MariaDB user-space; cannot install browsers"],
          ["Pre-installed browsers", "None (no Chrome/Chromium/Firefox/Edge binaries anywhere on disk)", "Selenium and Cypress run-modes cannot start a real browser"],
          ["Python 3.10 / Node 22 / Java 11", "Available", "Selenium/pytest, Cypress/Node, JMeter plan validation possible"],
          ["pypi.org / registry.npmjs.org egress", "Working", "pip and npm installs succeed"],
          ["Apache mirrors (dlcdn / archive / maven-central)", "Blocked by proxy (HTTP 403 on CONNECT)", "JMeter binary cannot be downloaded"],
          ["Memory / CPU", "3.8 GB RAM, 4 cores", "Insufficient for JMeter loads above ~50 threads even if JMeter were available"],
          ["Architecture", "Linux 6.8 aarch64 (Ubuntu 22.04)", "Some prebuilt x86 binaries would not run anyway"],
        ],
        [2200, 3700, 3460]
      ),

      // ======== SECTION 3: SELENIUM POM ========
      new Paragraph({ children: [new PageBreak()] }),
      h1("3. Selenium Framework (Python + pytest + POM)"),
      h2("3.1 Architecture"),
      p("The framework is laid out by responsibility: page objects in pages/, test cases in tests/, infrastructure helpers in utils/, configuration in config/config.yaml, test data in data/qa-data.json, and pytest hooks in conftest.py. Every page inherits from BasePage which wraps Selenium's WebDriverWait + ExpectedConditions to make explicit-wait the default (no implicit waits, no time.sleep). The driver factory uses Selenium Manager (bundled in Selenium 4.21) to auto-download the matching chromedriver, avoiding webdriver-manager."),
      h2("3.2 Page Objects (11 written)"),
      makeTable(
        ["File", "Class", "Purpose"],
        [
          ["pages/base_page.py", "BasePage", "Common navigation, find/click/type, screenshot, URL/title assertions"],
          ["pages/home_page.py", "HomePage", "Storefront landing — search bar, cart counter, My Account link"],
          ["pages/login_page.py", "LoginPage", "/account/login (#input-email, #input-password)"],
          ["pages/register_page.py", "RegisterPage", "/account/register full registration form"],
          ["pages/search_page.py", "SearchPage", "/product/search input + results"],
          ["pages/product_page.py", "ProductPage", "/product/product — quantity, add-to-cart"],
          ["pages/cart_page.py", "CartPage", "/checkout/cart — rows, remove, empty state"],
          ["pages/checkout_page.py", "CheckoutPage", "/checkout/checkout — login/guest options, confirm"],
          ["pages/account_page.py", "AccountPage", "/account/account — logout link"],
          ["pages/wishlist_page.py", "WishlistPage", "/account/wishlist — rows / empty"],
          ["pages/admin_login_page.py", "AdminLoginPage", "/administration — #input-username, #input-password"],
        ],
        [2700, 1900, 4760]
      ),
      h2("3.3 Test Cases (10 files, 15 collected pytest IDs)"),
      makeTable(
        ["File", "Manual TC", "Description"],
        [
          ["test_login_valid.py", "TC-AUTH-001", "Valid customer login redirects to /account/account"],
          ["test_login_invalid.py", "TC-AUTH-002..004", "4-row parameterised — wrong-pw / unknown-email / empty / malformed"],
          ["test_registration.py", "TC-REG-001", "Faker-generated valid registration reaches success page"],
          ["test_search.py", "TC-SEARCH-001/002/006", "Hits, no-match, and XSS-payload escape (CVE-2024-21517/58341 regression)"],
          ["test_add_to_cart.py", "TC-CART-001", "Add-to-cart updates header counter + cart line count"],
          ["test_remove_from_cart.py", "TC-CART-002", "Remove line empties the cart"],
          ["test_checkout_navigation.py", "TC-CHK-004", "Anonymous user sees login/guest options on checkout"],
          ["test_wishlist.py", "TC-NAV-002", "Anonymous /account/wishlist redirects to /account/login"],
          ["test_logout.py", "TC-AUTH-008", "Logout returns user to public landing"],
          ["test_admin_login.py", "TC-ADMIN-001", "Admin login produces user_token query parameter"],
        ],
        [2700, 1900, 4760]
      ),
      h2("3.4 Real Execution Evidence"),
      p("pip install (real)"),
      code(PIP_LOG),
      p("pytest --collect-only (real — confirms framework imports cleanly and 15 tests are discovered)"),
      code(COLLECT_LOG),
      p("pytest run (real — confirms the framework is correctly wired to Selenium Manager, which then correctly fails because no Chrome binary is installed in this sandbox)"),
      code(NOBROWSER.slice(-2200)),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== SECTION 4: CYPRESS ========
      h1("4. Cypress Framework"),
      h2("4.1 Architecture"),
      p("Cypress 13.13.0 with the mochawesome reporter, 2 run-mode retries, 1366×768 viewport, video recording on, screenshot-on-failure on. Custom commands wrap login, addProductToCart, clearCart. Page objects in cypress/pages/ provide a thin Selenium-style POM. Fixtures separate test data from logic."),
      h2("4.2 Specs"),
      makeTable(
        ["Spec", "describes", "it()s", "Manual TC"],
        [
          ["login_valid.cy.js", "1", "1", "TC-AUTH-001"],
          ["login_invalid.cy.js", "1", "1 (parameterized x4)", "TC-AUTH-002..004"],
          ["search.cy.js", "1", "3", "TC-SEARCH-001/002/006"],
          ["add_to_cart.cy.js", "1", "2", "TC-CART-001, TC-CART-003"],
          ["remove_from_cart.cy.js", "1", "1", "TC-CART-002"],
          ["cart_validation.cy.js", "1", "2", "TC-CART-003 (qty 0, qty -1)"],
          ["checkout.cy.js", "1", "1", "TC-CHK-004"],
          ["wishlist.cy.js", "1", "1", "TC-NAV-002"],
          ["logout.cy.js", "1", "1", "TC-AUTH-008"],
          ["navigation.cy.js", "1", "1", "TC-NAV-001"],
        ],
        [2700, 1300, 1700, 3660]
      ),
      h2("4.3 Real Execution Evidence"),
      p("npm install (real — 280 packages including cypress 13.13.0)"),
      code(NPM_LOG),
      p("Spec enumeration + config parse (real)"),
      code(CYPRESS_LOG),
      p("Cypress requires a browser to enter run mode. No browser is available in this sandbox; therefore no Cypress run was executed against a SUT. The bundled Electron binary would normally provide its own browser, but on this aarch64 Linux sandbox we set CYPRESS_INSTALL_BINARY=0 to avoid a guaranteed-to-fail download in CI; on a developer workstation, npm ci will pull the Electron bundle automatically."),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== SECTION 5: POSTMAN / NEWMAN ========
      h1("5. API Testing (Postman + Newman)"),
      h2("5.1 Reality of OpenCart's API surface"),
      p("OpenCart 4.x ships the legacy storefront API under index.php?route=api/<controller>[.method]. Inputs are form-urlencoded, responses are JSON, and authentication is performed via api/login which returns a 32-char api_token to be appended as a query parameter on every subsequent call. There is no OpenAPI/Swagger surface in core; this collection is built against that real shape rather than wishful thinking."),
      h2("5.2 Collection contents (10 requests)"),
      makeTable(
        ["#", "Name", "Method", "Route", "Notable assertion"],
        [
          ["API-01", "Login (happy path)", "POST", "api/login", "api_token (32 hex chars), responseTime < 1500 ms"],
          ["API-02", "Login (invalid key)", "POST", "api/login", "error.key is set"],
          ["API-03", "Login (missing username)", "POST", "api/login", "error.username is set"],
          ["API-04", "Add to cart", "POST", "api/cart.add", "tv4 schema valid"],
          ["API-05", "Cart products", "GET", "api/cart.products", "products[] present"],
          ["API-06", "Edit quantity (BVA 0)", "POST", "api/cart.edit", "either success OR error returned"],
          ["API-07", "Shipping methods", "GET", "api/shipping.methods", "status 200"],
          ["API-08", "Payment methods", "GET", "api/payment.methods", "status 200"],
          ["API-09", "Create order", "POST", "api/order.add", "order_id returned on success"],
          ["API-10", "Unauthorized call", "GET", "api/cart.products", "error.api_token on stale token"],
        ],
        [600, 2400, 800, 2500, 3060]
      ),
      h2("5.3 Real Newman execution"),
      p("Newman 6.2.1 ran the collection against the empty SUT (no OpenCart on http://localhost:8080) and produced both an HTML and JSON report. Stats are taken directly from reports/artifacts/newman/newman-result.json."),
      makeTable(
        ["Counter", "Total", "Failed"],
        [
          ["Iterations", String(nStats.iterations.total), String(nStats.iterations.failed)],
          ["Requests", String(nStats.requests.total), String(nStats.requests.failed)],
          ["Test scripts", String(nStats.tests.total), String(nStats.tests.failed)],
          ["Assertions", String(nStats.assertions.total), String(nStats.assertions.failed)],
        ],
        [3120, 3120, 3120]
      ),
      p("All 10 requests fail at the network layer with ECONNREFUSED 127.0.0.1:8080 — proving the collection is well-formed (Newman parses it, runs every script, evaluates every assertion) but also confirming there is no SUT. The HTML report (newman-result.html, 242 KB) lives in reports/artifacts/newman/."),
      p("Excerpted Newman output (real, tail):"),
      code(NEWMAN_LOG.slice(-2200)),

      new Paragraph({ children: [new PageBreak()] }),

      // ======== SECTION 6: JMETER ========
      h1("6. Performance Testing (Apache JMeter)"),
      h2("6.1 Plans"),
      p("Two plans live in jmeter/plans/: OpenCart-Smoke.jmx (5 users, 30 s) and OpenCart-Full.jmx (parameterised via -J properties to drive load / peak / stress / spike / endurance from a single file)."),
      makeTable(
        ["Profile", "Command", "Threads", "Ramp-up", "Duration"],
        [
          ["Smoke", "OpenCart-Smoke.jmx", "5", "5 s", "30 s"],
          ["Load baseline", "OpenCart-Full.jmx -Jthreads=50  -Jrampup=60  -Jduration=300", "50", "60 s", "5 min"],
          ["Load peak", "OpenCart-Full.jmx -Jthreads=250 -Jrampup=120 -Jduration=300", "250", "120 s", "5 min"],
          ["Stress", "OpenCart-Full.jmx -Jthreads=500 -Jrampup=180 -Jduration=300", "500", "180 s", "5 min"],
          ["Spike", "OpenCart-Full.jmx -Jthreads=500 -Jrampup=30  -Jduration=120", "500", "30 s", "2 min"],
          ["Endurance", "OpenCart-Full.jmx -Jthreads=100 -Jrampup=120 -Jduration=3600", "100", "120 s", "60 min"],
        ],
        [1800, 4200, 1100, 1100, 1160]
      ),
      h2("6.2 Sampler coverage"),
      p("Each plan contains five HTTP samplers covering the realistic browsing path of a customer: GET /, GET /index.php?route=product/category&path=20, GET /index.php?route=product/product&product_id=42, GET /index.php?route=product/search&search=phone, POST /index.php?route=checkout/cart.add (product_id, quantity). HTTP Defaults, HTTP Cookie Manager, and HTTP Header Manager set per-thread sessions and a realistic User-Agent."),
      h2("6.3 Why no JMeter run in this sandbox"),
      p("The Apache JMeter binary distribution is hosted under dlcdn.apache.org, archive.apache.org, and Maven Central. The sandbox HTTP proxy returns HTTP 403 from CONNECT on all three. With no way to obtain a JMeter binary and no SUT to load anyway, no JMeter run was performed. The plans themselves were XML-validated using Python's ElementTree parser (real output, see Appendix log 06)."),
      h2("6.4 Results template (to be filled by the team on a real run)"),
      makeTable(
        ["Scenario", "Avg (ms)", "p90 (ms)", "p95 (ms)", "Throughput (req/s)", "Error %"],
        [
          ["Smoke (5 users, 30 s)", "[TBD]", "[TBD]", "[TBD]", "[TBD]", "[TBD]"],
          ["Load baseline (50)", "[TBD]", "[TBD]", "[TBD]", "[TBD]", "[TBD]"],
          ["Load peak (250)", "[TBD]", "[TBD]", "[TBD]", "[TBD]", "[TBD]"],
          ["Stress (500)", "[TBD]", "[TBD]", "[TBD]", "[TBD]", "[TBD]"],
          ["Spike (0→500)", "[TBD]", "[TBD]", "[TBD]", "[TBD]", "[TBD]"],
          ["Endurance (100 × 60 min)", "[TBD]", "[TBD]", "[TBD]", "[TBD]", "[TBD]"],
        ],
        [2400, 1380, 1380, 1380, 1500, 1320]
      ),

      // ======== SECTION 7: CI/CD ========
      new Paragraph({ children: [new PageBreak()] }),
      h1("7. CI/CD — GitHub Actions"),
      p("The pipeline .github/workflows/qa.yml has four jobs, all triggered on push to main/develop, on pull requests, and manually via workflow_dispatch:"),
      bullet("selenium — boots the Docker stack, installs Python deps, runs pytest with HTML report, uploads artifacts."),
      bullet("cypress — boots Docker stack, runs cypress-io/github-action@v6 against http://localhost:8080, uploads videos and screenshots."),
      bullet("api — installs Newman + htmlextra reporter, boots Docker stack, runs the OpenCart collection, uploads HTML report."),
      bullet("jmeter-smoke — boots Docker stack, downloads JMeter 5.6.3, runs OpenCart-Smoke.jmx (5 users, 30 s), uploads JTL + dashboard."),
      p("Quality gates: 100 % of P1 tests must pass; ≥ 95 % overall pass rate; Selenium + Cypress + Newman all green; no new dependency CVE of CVSS ≥ 7; artefacts uploaded. JMeter heavy profiles run only on self-hosted runners because GitHub's 2-core 7 GB free tier cannot sustain 250+ thread loads."),

      // ======== SECTION 8: MANUAL & DEFECTS ========
      h1("8. Manual Test Cases & Defect Templates"),
      p("tests/manual/test-cases.csv ships 50 test cases — 10 Authentication, 10 Registration, 6 Search, 3 Catalog, 6 Cart, 5 Checkout, 5 Admin, 5 Nav/Responsive/Compat. Techniques applied: equivalence partitioning, boundary value analysis, decision tables, state transition, and security-flavoured negative tests (including CVE regressions for CVE-2024-21517 reflected XSS and CVE-2024-58341 search SQLi)."),
      p("bugs/BUG-template.md provides a one-page severity/priority/preconditions defect template. bugs/examples.md contains 15 example defects (BUG-001..015), each clearly tagged as a hypothesis to be verified in your install — e.g., BUG-005 retests the CVE-2024-21517 XSS fix; BUG-006 retests CVE-2024-58341 SQLi; BUG-015 verifies session-ID rotation on login (OWASP A07)."),
      makeTable(
        ["Severity", "Definition", "Priority", "Fix horizon"],
        [
          ["S1 Critical", "Data loss, security breach, checkout unusable", "P1 Immediate", "Hotfix"],
          ["S2 Major", "Major feature broken, no workaround", "P2 High", "Next sprint"],
          ["S3 Minor", "Feature partially broken, workaround exists", "P3 Medium", "Backlog"],
          ["S4 Cosmetic", "UI/text issue, no functional impact", "P4 Low", "Deferred"],
        ],
        [1800, 4500, 1500, 1560]
      ),

      // ======== SECTION 9: ISO/IEC 25010:2023 ========
      new Paragraph({ children: [new PageBreak()] }),
      h1("9. ISO/IEC 25010:2023 Quality Analysis"),
      p("The 2023 revision adds Safety as a new top-level characteristic, renames Usability → Interaction Capability, renames Portability → Flexibility, and adds Scalability + Inclusivity sub-characteristics. The matrix below maps each characteristic to OpenCart-specific observation points and evidence pointers. Numeric scores must be assigned by the team after live execution."),
      makeTable(
        ["Characteristic (2023)", "Sub-characteristics", "OpenCart observation points", "Evidence pointer"],
        [
          ["Functional Suitability", "Completeness, correctness, appropriateness", "Documented features work; field errors are correct; localization present", "Selenium/Cypress + TC-AUTH/REG/CHK/CART"],
          ["Performance Efficiency", "Time behaviour, resource utilization, capacity", "JMeter p95 < 2 s @ 100 users; docker stats CPU/mem within bounds", "jmeter/results/*-html"],
          ["Compatibility", "Co-existence, interoperability", "CSV import/export; Chrome/Firefox/Edge parity", "TC-COMPAT-001"],
          ["Interaction Capability (was Usability)", "Recognizability, learnability, operability, user error protection, engagement, inclusivity, self-descriptiveness, accessibility", "Heuristic walkthrough + Lighthouse audit", "Manual notes"],
          ["Reliability", "Faultlessness (was maturity), availability, fault tolerance, recoverability", "Endurance test; docker compose restart recovery", "jmeter endurance dashboard"],
          ["Security", "Confidentiality, integrity, non-repudiation, accountability, authenticity, resistance", "XSS/SQLi regression, ZAP baseline, cookie/session inspection", "TC-AUTH-010, TC-SEARCH-006, TC-REG-010, BUG-005/006/014/015"],
          ["Maintainability", "Modularity, reusability, analysability, modifiability, testability", "extension/ structure, OCMOD usage, log granularity", "Code review"],
          ["Flexibility (was Portability)", "Adaptability, scalability, installability, replaceability", "Docker portability, multi-store, theme switching", "infra/"],
          ["Safety (new in 2023)", "Operational constraint, risk identification, fail safe, hazard warning, safe integration", "Duplicate-submit guard at checkout, refund safety, audit trails", "TC-CHK-001 + manual"],
        ],
        [2000, 2200, 3000, 2160]
      ),

      // ======== SECTION 10: WORK SPLIT ========
      h1("10. Three-Person Work Split"),
      makeTable(
        ["Role", "Owns (sections)", "Primary deliverables"],
        [
          ["Person 1 — Manual & Defect Lead", "§ 8 manual TCs, §9 ISO matrix, defect lifecycle, traceability", "tests/manual/test-cases.csv, bugs/*.md, ISO 25010 scoring"],
          ["Person 2 — UI Automation Engineer", "§ 3 Selenium, § 4 Cypress, fixtures, parallel runs", "selenium-framework/, cypress-framework/, parallel reports"],
          ["Person 3 — Backend & DevOps Lead", "§ 1 infra, § 5 API, § 6 JMeter, § 7 CI, report assembly", "infra/, postman/, jmeter/, .github/workflows/qa.yml"],
        ],
        [2700, 2700, 3960]
      ),

      // ======== SECTION 11: RECOMMENDATIONS / RUN INSTRUCTIONS ========
      new Paragraph({ children: [new PageBreak()] }),
      h1("11. How to Run the Suite on Your Workstation"),
      p("On a Linux/macOS host with Docker + a modern Chrome installed:"),
      code("# 1. Bring the stack up"),
      code("cd infra && docker compose up -d"),
      code("docker compose logs -f opencart   # wait for: ** OpenCart setup finished! **"),
      code(""),
      code("# 2. Snapshot the clean state and seed test data"),
      code("docker compose exec mariadb mysqldump -ubn_opencart -popencart_pw_change_me bitnami_opencart > ../seeds/opencart_clean.sql"),
      code("# (Add the 3 test users + 5 priced products through the admin or via SQL)"),
      code(""),
      code("# 3. Selenium"),
      code("cd ../selenium-framework && pip install -r requirements.txt"),
      code("pytest -n 2 --reruns 1   # writes reports/report.html"),
      code(""),
      code("# 4. Cypress"),
      code("cd ../cypress-framework && npm ci"),
      code("npx cypress run          # writes cypress/reports/html/index.html"),
      code(""),
      code("# 5. API"),
      code("newman run ../postman/opencart-api.postman_collection.json -e ../postman/local.postman_environment.json -r cli,htmlextra"),
      code(""),
      code("# 6. JMeter"),
      code("jmeter -n -t ../jmeter/plans/OpenCart-Smoke.jmx -l results/smoke.jtl -e -o results/smoke-html"),

      // ======== SECTION 12: APPENDIX ========
      new Paragraph({ children: [new PageBreak()] }),
      h1("Appendix A — Raw Logs from this Sandbox Run"),
      h2("A.1 — 02-pytest-collect.log (real)"),
      code(COLLECT_LOG),
      h2("A.2 — 06-jmeter.log (real)"),
      code(JMETER_LOG),
      h2("A.3 — Files delivered in qa-opencart/ (count)"),
      p("110 source files (excluding npm node_modules); see reports/EXECUTION_LOG.md for the per-folder file count."),

      h1("Appendix B — Caveats and Honesty Notes"),
      bullet("No fabricated screenshots are included in this report. The screenshot infrastructure (conftest.py screenshot-on-fail, Cypress screenshotOnRunFailure) is wired and will produce real PNGs the moment the suite runs against a real browser."),
      bullet("No fabricated response times, throughput, or error percentages are included. The JMeter results table contains [TBD] placeholders to be filled by the team after a real run."),
      bullet("CVE identifiers (CVE-2024-21517, CVE-2024-58341, CVE-2024-21519, CVE-2024-36694) are used only as inspiration for negative test cases. The team must verify each one on the live install and report only what is actually observed. CVE-2024-40420 was rejected by MITRE on 2024-12-18 as a duplicate of CVE-2024-36694; the correct identifier is CVE-2024-36694 (CVSS 3.1 = 7.2 HIGH per CISA-ADP on NVD)."),
      bullet("ISO/IEC 25010:2023 numeric scores are intentionally left blank — they must come from real observation, not from this report."),
      bullet("demo.opencart.com was NOT used as a test target during this run, in line with the project guidance."),
      bullet("This report contains real verbatim log excerpts from the sandbox session it was generated in. The full raw logs live under qa-opencart/reports/logs/."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(path.join(__dirname, "OpenCart_QA_Execution_Report.docx"), buf);
  console.log("wrote OpenCart_QA_Execution_Report.docx — " + buf.length + " bytes");
});
