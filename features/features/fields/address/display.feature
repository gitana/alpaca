Feature: Display
  As a developer of a system using alpaca
  I want my address fields to display correctly
  So that I can develop applications faster

  Scenario: Address Field
    Given I am on a page with an address field
    Then I should see 4 "input[type='text']" tags
      And I should see 1 "select" tag
