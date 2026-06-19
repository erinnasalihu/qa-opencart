# ISO/IEC 25010:2023 Quality Analysis Matrix — OpenCart 4.1.x

The product-quality model used here is the **2023 revision** (9 characteristics).
Each characteristic lists OpenCart-specific observation points and an
evidence pointer that must be filled from real execution.

| Characteristic | Sub-characteristics (2023) | OpenCart-specific observations | Evidence pointer |
|---|---|---|---|
| Functional Suitability | Functional completeness, correctness, appropriateness | Does each documented feature work? Are field-level errors correct? Are localized texts present? | TC-AUTH-001..010, TC-REG-001..010, TC-CHK-001..005 |
| Performance Efficiency | Time behaviour, resource utilization, capacity | JMeter p95 < 2 s at 100 users? Docker `stats` CPU/mem within bounds? | `jmeter/results/*-html` |
| Compatibility | Co-existence, interoperability | Imports/exports via CSV (admin)? Coexists with other apps on the same host? | TC-COMPAT-001 + manual |
| Interaction Capability (was Usability) | Appropriateness recognizability, learnability, operability, user error protection, user engagement, inclusivity, self-descriptiveness, accessibility | Heuristic walkthrough + Lighthouse accessibility audit | manual notes |
| Reliability | Faultlessness (was maturity), availability, fault tolerance, recoverability | Endurance test, recovery via `docker compose restart`, rollback of failed orders | `jmeter/results/endurance-html` |
| Security | Confidentiality, integrity, non-repudiation, accountability, authenticity, resistance | XSS / SQLi regression, OWASP ZAP baseline, cookie inspection | TC-AUTH-010, TC-SEARCH-006, TC-REG-010, BUG-005, BUG-006, BUG-014, BUG-015 |
| Maintainability | Modularity, reusability, analysability, modifiability, testability | Extension folder structure, OCMOD usage, log granularity | code review |
| Flexibility (was Portability) | Adaptability, scalability, installability, replaceability | Docker portability, multi-store support, theme switching | infra/ |
| Safety (new) | Operational constraint, risk identification, fail safe, hazard warning, safe integration | Duplicate-submit guard at checkout, refund safety, audit trails | TC-CHK-001 |

## Scoring

For each sub-characteristic, score 1–5 with a short justification + evidence
pointer (TC-ID or screenshot path). Aggregate per characteristic into a radar
chart in the final report.

| Characteristic | Score (1–5) | Justification | Evidence |
|---|---|---|---|
| Functional Suitability | [INSERT] | [INSERT] | [INSERT] |
| Performance Efficiency | [INSERT] | [INSERT] | [INSERT] |
| Compatibility | [INSERT] | [INSERT] | [INSERT] |
| Interaction Capability | [INSERT] | [INSERT] | [INSERT] |
| Reliability | [INSERT] | [INSERT] | [INSERT] |
| Security | [INSERT] | [INSERT] | [INSERT] |
| Maintainability | [INSERT] | [INSERT] | [INSERT] |
| Flexibility | [INSERT] | [INSERT] | [INSERT] |
| Safety | [INSERT] | [INSERT] | [INSERT] |
