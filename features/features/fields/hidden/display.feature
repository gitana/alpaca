Feature: Display
  As a developer of a system using alpaca
  I want my hidden fields to display correctly (that is not to display)
  So that I can develop applications faster

  Scenario: Hidden Field
    Given I am on a page with a hidden field
    Then I should see 0 "input" tags
