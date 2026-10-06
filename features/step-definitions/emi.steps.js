const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
const { EmiCalculatorPage } = require('../../pages/EmiCalculatorPage');

setDefaultTimeout(90000);

Before(async function () {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.emiPage = new EmiCalculatorPage(this.page);
});

After(async function () {
  if (this.browser) await this.browser.close();
});

Given('I open the EMI Calculator', async function () {
  await this.emiPage.open();
});

When('I select the {string} loan type', async function (loanType) {
  await this.emiPage.selectLoanType(loanType);
});

When('I calculate the EMI for amount {string}, rate {string} and tenure {string} years', async function (amount, rate, years) {
  this.expectedEmi = this.emiPage.calculateMonthlyEmi(Number(amount), Number(rate), Number(years));
  await this.emiPage.enterLoanInputs(Number(amount), Number(rate), Number(years));
});

Then('the displayed EMI should be close to my independently calculated EMI', async function () {
  const displayed = await this.emiPage.readDisplayedEmi();
  expect(displayed, 'Could not read a positive EMI from the page').toBeGreaterThan(0);
  // Website formatting/rounding can differ by a few rupees.
  expect(Math.abs(displayed - this.expectedEmi)).toBeLessThanOrEqual(Math.max(10, this.expectedEmi * 0.01));
});

Then('the pie chart should be visible with positive values', async function () {
  await this.emiPage.assertChartVisible();
  const values = await this.emiPage.extractChartNumbers();
  expect(values.length, 'Expected numeric values associated with the chart').toBeGreaterThan(0);
  expect(values.some(value => value > 0), 'Expected at least one positive chart value').toBeTruthy();
});

Then('the chart should be visible', async function () {
  await this.emiPage.assertChartVisible();
});
