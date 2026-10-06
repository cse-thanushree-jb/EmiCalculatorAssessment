Feature: EMI calculator UI validation

  Background:
    Given I open the EMI Calculator

  Scenario Outline: Validate Home Loan EMI and pie chart
    When I select the "Home Loan" loan type
    And I calculate the EMI for amount "<amount>", rate "<rate>" and tenure "<years>" years
    Then the displayed EMI should be close to my independently calculated EMI
    And the pie chart should be visible with positive values

    Examples:
      | amount  | rate | years |
      | 2500000 | 10   | 10    |
      | 5000000 | 7.5  | 15    |

  Scenario: Validate Personal Loan chart
    When I select the "Personal Loan" loan type
    And I calculate the EMI for amount "1000000", rate "12" and tenure "5" years
    Then the chart should be visible
