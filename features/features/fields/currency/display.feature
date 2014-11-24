Feature: Display
  As a developer of a system using alpaca
  I want my currency fields to display correctly
  So that I can develop applications faster

  Scenario: Currency Field
    Given I am on a page with a currency field
    Then I should see 1 "input[type='text']" tag

  Scenario: Currency Field Formatting
    Given I am on a page with a currency field
    When I click on "input" and type "500"
    Then the "input" tag's value should be "$5.00"
