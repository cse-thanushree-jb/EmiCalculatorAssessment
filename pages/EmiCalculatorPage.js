const { expect } = require('@playwright/test');

class EmiCalculatorPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    const url = process.env.BASE_URL || 'https://emicalculator.net/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  async selectLoanType(name) {
    // Prefer accessible links/buttons; fall back to visible text only when necessary.
    const candidates = [
      this.page.getByRole('link', { name: new RegExp(name, 'i') }).first(),
      this.page.getByRole('tab', { name: new RegExp(name, 'i') }).first(),
      this.page.getByRole('button', { name: new RegExp(name, 'i') }).first(),
      this.page.getByText(new RegExp(`^${name}$`, 'i')).first()
    ];
    for (const locator of candidates) {
      if (await locator.count().catch(() => 0)) {
        await locator.click({ timeout: 5000 }).catch(() => {});
        return;
      }
    }
    // Some versions show loan tabs as text inside a custom navigation element.
    throw new Error(`Could not find a clickable loan type named "${name}". Inspect the current site DOM and update the POM.`);
  }

  async enterLoanInputs(amount, rate, years) {
    // Accessible name matching avoids coupling tests to DOM position.
    const amountLocator = this.findInput(/loan amount|amount/i);
    const rateLocator = this.findInput(/interest rate|rate of interest/i);
    const tenureLocator = this.findInput(/loan tenure|tenure|period/i);

    await this.setNumericControl(amountLocator, amount);
    await this.setNumericControl(rateLocator, rate);
    await this.setNumericControl(tenureLocator, years);
    await this.page.waitForTimeout(700);
  }

  findInput(pattern) {
    const byLabel = this.page.getByLabel(pattern).first();
    const byPlaceholder = this.page.getByPlaceholder(pattern).first();
    const byRole = this.page.getByRole('spinbutton').filter({ has: this.page.locator('input') }).first();
    // Locator union is not available in every Playwright version; use a custom locator facade.
    const thisPageInputs = this.page.getByRole('spinbutton').first();
    return {
      async count() {
        const a = await byLabel.count().catch(() => 0);
        const b = await byPlaceholder.count().catch(() => 0);
        const c = await byRole.count().catch(() => 0);
        return a || b || c;
      },
      async fill(value) {
        if (await byLabel.count().catch(() => 0)) return byLabel.fill(String(value));
        if (await byPlaceholder.count().catch(() => 0)) return byPlaceholder.fill(String(value));
        const inputs = thisPageInputs;
        return inputs.fill(String(value));
      },
      async press(key) {
        if (await byLabel.count().catch(() => 0)) return byLabel.press(key);
        if (await byPlaceholder.count().catch(() => 0)) return byPlaceholder.press(key);
        return byRole.press(key);
      }
    };
  }

  async setNumericControl(control, value) {
    if (await control.count()) {
      await control.fill(String(value)).catch(async () => {
        await control.press('Control+A').catch(() => {});
        await control.press(String(value)).catch(() => {});
      });
      return;
    }
    // Dynamic fallback: locate a visible numeric input by its accessible label/title/placeholder.
    const inputs = this.page.locator('input[type="number"], input[inputmode="decimal"], input[type="text"]');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      if (await input.isVisible().catch(() => false) && await input.isEditable().catch(() => false)) {
        const label = `${await input.getAttribute('aria-label') || ''} ${await input.getAttribute('placeholder') || ''} ${await input.getAttribute('title') || ''}`;
        if (/amount|interest|rate|tenure|period|year/i.test(label)) {
          await input.fill(String(value));
          return;
        }
      }
    }
    throw new Error(`Could not locate editable control for value ${value}. Inspect live accessible names and update the page object.`);
  }

  calculateMonthlyEmi(principal, annualRate, years) {
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    if (!monthlyRate) return principal / months;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  async readDisplayedEmi() {
    const pageText = await this.page.locator('body').innerText();

    // Find the "Loan EMI" section and read the rupee amount
    // immediately associated with it.
    const loanEmiIndex = pageText.search(/Loan EMI/i);

    if (loanEmiIndex === -1) {
      throw new Error('Could not find "Loan EMI" text on the page.');
    }

    const resultSection = pageText.substring(loanEmiIndex, loanEmiIndex + 300);

    const matches = resultSection.match(/₹\s*[\d,]+(?:\.\d+)?/g) || [];

    for (const value of matches) {
      const number = Number(value.replace(/[^\d.]/g, ''));

      if (Number.isFinite(number) && number > 0) {
        return number;
      }
    }

    throw new Error(
      `Could not parse displayed EMI from result section: ${resultSection}`
    );
  }
  async assertChartVisible() {
    const chart = this.page.locator('canvas, svg, [role="img"]').filter({ visible: true }).first();
    await expect(chart).toBeVisible({ timeout: 15000 });
  }

  async extractChartNumbers() {
    const text = await this.page.locator('body').innerText();
    const matches = text.match(/(?:₹|Rs\.?|INR)\s*[\d,]+(?:\.\d+)?/gi) || [];
    return matches.map(value => Number(value.replace(/[^\d.]/g, ''))).filter(Number.isFinite);
  }
}

// Four intentionally broken examples for the self-healing exercise.
// Do not use these in active test steps; they are deliberately brittle.
const intentionallyBrokenLocators = {
  oldAmount: 'div.container > div:nth-child(3) > input',
  oldInterest: '//div[4]/div[2]/input[1]',
  oldCalculate: '#calculateBtn_old',
  oldPieChart: '.result-panel > div:nth-child(5) canvas'
};

module.exports = { EmiCalculatorPage, intentionallyBrokenLocators };
