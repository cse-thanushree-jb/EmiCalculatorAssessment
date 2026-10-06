# EMI Calculator Automation Assessment (Section A)

A starter submission repository using Playwright, Cucumber, Page Object Model, API checks, and SQL examples.

## Requirements
- Node.js 18+ (Node.js 20 LTS recommended)
- npm
- Internet access to reach `https://emicalculator.net/` and JSONPlaceholder

## Setup
```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` if you want to configure the application URL:
- Windows PowerShell: `Copy-Item .env.example .env`
- macOS/Linux: `cp .env.example .env`

The URL is read from `BASE_URL`; it is not hardcoded in the page objects or steps.

## Run
Run the Cucumber UI scenarios:
```bash
npm run test:ui
```

Run JSONPlaceholder API tests:
```bash
npm run test:api
```

Run both:
```bash
npm test
```

API HTML report (if generated):
```bash
npx playwright show-report
```

## Architecture
- `features/emi_calculator.feature`: Gherkin scenarios
- `features/step-definitions/emi.steps.js`: Cucumber step definitions and browser lifecycle
- `pages/EmiCalculatorPage.js`: Page Object Model and resilient locator helpers
- `tests/api/jsonplaceholder.spec.js`: Playwright API tests
- `sql/`: schemas, sample data, and both SQL scenarios
- `self-healing/AI_SELF_HEALING.md`: proposed AI locator healing workflow
- `test-results/` and `playwright-report/`: generated on execution; add actual results before submitting

## Important validation notes
The live EMI Calculator website may change its markup, input labels, chart implementation, or slider behavior. This project uses accessible locators where possible and includes locator discovery fallbacks, but you must run it locally and adjust any selector based on the current live page. Never report tests as passing unless they passed in your own run.

JSONPlaceholder is a fake REST API. Its POST endpoint generally accepts arbitrary JSON and returns `201 Created`; it does not reliably validate missing fields, long strings, or special characters with 4xx responses. The API tests assert observed contract behavior and record this limitation rather than inventing error responses.

## AI self-healing exercise
The `pages/EmiCalculatorPage.js` file includes four deliberately broken locator examples in a separate, non-executed `intentionallyBrokenLocators` object. They are intentionally not used by the working steps. See `self-healing/AI_SELF_HEALING.md` for detection, prompting, validation, and safe application guidance.

## Claude Code / AI reflection (template to personalize)
## AI-assisted development reflection

I used AI assistance during development to help understand the Playwright + Cucumber framework, troubleshoot configuration and test failures, and improve Playwright locators and test validation.

I validated the AI suggestions by running the tests locally. During troubleshooting, I corrected issues such as the Cucumber configuration, missing `dotenv` dependency, missing Chromium installation, and an EMI locator that initially captured an incorrect value.

The final UI, API, and SQL results in this repository are based on tests that I actually executed and verified locally.

## Before GitHub submission
## Before GitHub submission

1. Run the UI and API tests and inspect all failures. **Completed successfully.**
2. Save actual test-result evidence; do not create or claim fake test results. **Completed under `artifacts/`.**
3. Add screenshots or traces from your own execution if required.
4. Review SQL outputs using the JavaScript SQLite runner and capture genuine evidence. **Completed successfully.**
5. Update the AI reflection to describe the actual development and validation process. **Completed.**
6. Do not commit `.env`, `node_modules/`, generated reports, or secrets.