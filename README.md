# OpenCart QA Test Package

Course-project QA harness for **OpenCart 4.1.x** running locally via Docker.
Includes manual test cases, two automation frameworks, an API suite, performance
plans, CI/CD, defect templates, and an ISO/IEC 25010 quality analysis matrix.

## Layout
```
qa-opencart/
├── infra/                 # docker-compose.yml + seed/restore notes
├── seeds/                 # opencart_clean.sql snapshots (created post-install)
├── selenium-framework/    # Python + pytest + Selenium 4 + POM
├── cypress-framework/     # Cypress 13 + mochawesome reporter
├── postman/               # OpenCart legacy api/* collection + envs
├── jmeter/                # Smoke + Full JMX plans (parameterized profiles)
├── .github/workflows/     # GitHub Actions pipeline
├── tests/manual/          # 50 manual test cases (CSV/MD workbook)
├── bugs/                  # Defect templates + 15 example defect cards
├── docs/                  # Final report (Word) + ISO 25010 matrix
└── reports/               # Real execution outputs from THIS sandbox run
```

## Quick start (developer workstation with Docker + Chrome)
```bash
cd infra && docker compose up -d
cd ../selenium-framework  && pip install -r requirements.txt && pytest
cd ../cypress-framework   && npm ci && npx cypress run
cd ..                     && newman run postman/opencart-api.postman_collection.json -e postman/local.postman_environment.json
cd jmeter && jmeter -n -t plans/OpenCart-Smoke.jmx -l results/smoke.jtl -e -o results/smoke-html
```
