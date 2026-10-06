# AI locator self-healing exercise

## Deliberately broken locators
`pages/EmiCalculatorPage.js` exports four deliberately broken examples:
- `oldAmount`
- `oldInterest`
- `oldCalculate`
- `oldPieChart`

They are intentionally not called by active tests, so the normal test flow is not sabotaged by the exercise.

## Proposed workflow
1. **Detect:** run the suite and collect Playwright error output, failed locator details, screenshot, trace, URL, and relevant DOM/accessibility snapshot.
2. **Gather evidence:** inspect the current page and identify the intended control from its visible label, role, accessible name, nearby text, and stable test IDs. Do not ask the model to guess from the selector alone.
3. **Prompt:** ask an AI coding assistant to propose one or more locator alternatives based only on supplied DOM evidence. Require it to explain why the locator matches the intended element and whether it could match multiple elements.
4. **Validate:** check the candidate locator count, visibility, enabled state, and accessible name. Run the targeted test first, then the relevant suite. Review the trace/screenshot and ensure the locator still targets the intended control.
5. **Apply safely:** propose a patch rather than editing files silently. Keep the diff small, remove stale selectors, and require human review before merging.
6. **Avoid unsafe healing:** never click a merely similar element when the original target is ambiguous; do not weaken assertions or skip tests just to get a green build.

## Example prompt
> A Playwright test failed because this locator no longer matches: `<paste locator>`. Here is the current relevant DOM/accessibility snapshot and screenshot description: `<evidence>`. The intended control is `<purpose>`. Propose the most resilient Playwright locator using role, label, text, or a stable test ID. Explain ambiguity and provide a short validation snippet using `count()`, `isVisible()`, and an assertion. Do not invent attributes absent from the evidence, and do not modify assertions.

## Optional proof-of-concept validation snippet
```js
const candidate = page.getByRole('button', { name: 'Calculate', exact: true });
await expect(candidate).toHaveCount(1);
await expect(candidate).toBeVisible();
await expect(candidate).toBeEnabled();
```

## Limitation
This repository documents the AI-assisted healing approach but does not automatically rewrite selectors. Automated self-modification of test code is risky without DOM evidence, validation, and human review.
