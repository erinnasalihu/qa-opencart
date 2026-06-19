# Sandbox execution log — what was actually run

| Step | Tool | Result | Log |
|---|---|---|---|
| Probe sandbox capabilities | bash | docker=NO, browsers=NO, php=NO, python3/node22/java11=YES | (above) |
| 1. pip install minimal Selenium deps | `pip install --user selenium pytest pyyaml faker pytest-html` | Selenium 4.21.0, pytest 8.2.2, faker 25.8.0, pyyaml 6.0.1 — `rc=0` | logs/01-pip-install.log |
| 2. `pytest --collect-only` against `selenium-framework/` | pytest 8.2.2 | **15 tests collected** in 0.03s — `rc=0` | logs/02-pytest-collect.log |
| 3. `pytest` actual run | pytest + Selenium Manager | **NoSuchDriverException for chrome** (expected — no browser in sandbox) | logs/03-pytest-run-no-browser.log |
| 4. `npm install` Cypress + reporter | npm 10.9 + node 22 | **280 packages installed**, cypress 13.13.0 — Electron binary intentionally skipped (`CYPRESS_INSTALL_BINARY=0`) | logs/04-npm-install.log |
| 5. `npm install` newman + htmlextra | npm | **166 packages**, newman 6.2.1 — `rc=0` | logs/05-newman.log |
| 5b. `newman run` full collection vs http://localhost:8080 | newman 6.2.1 | 10 requests, 10 test scripts, **18 assertions**, **28 failures** (all ECONNREFUSED — no SUT), HTML + JSON written | logs/05-newman.log, artifacts/newman/ |
| 6. JMeter binary download attempts | curl | **All Apache mirrors blocked by proxy (HTTP 403)** | logs/06-jmeter.log |
| 6b. JMX XML validation | Python ElementTree | Both `OpenCart-Smoke.jmx` and `OpenCart-Full.jmx` parse cleanly; 5 HTTPSamplerProxy each; structure as documented | logs/06-jmeter.log |
| 7. Cypress spec + config enumeration | node | **10 specs found, 14 `it()` blocks**, viewport 1366×768, retries {runMode:2,openMode:0}, baseUrl http://localhost:8080 | logs/07-cypress-collect.log |
| 8. Build final docx via `docx-js` | node + docx 9.x | **530 paragraphs, all validations PASSED** | docs/OpenCart_QA_Execution_Report.docx |

## File counts

```
$ find qa-opencart -type f | grep -v 'node_modules\|.npm-tools' | wc -l
110
```

## Verbatim final newman stats

```
iterations : { total: 1, pending: 0, failed: 0 }
requests   : { total: 10, pending: 0, failed: 10 }
tests      : { total: 10, pending: 0, failed: 0 }
assertions : { total: 18, pending: 0, failed: 18 }
failures   : 28
executions : 10
```

## Verbatim final pytest collect

```
15 tests collected in 0.03s
rc=0
```
