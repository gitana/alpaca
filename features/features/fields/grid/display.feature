Feature: Display
  As a developer of a system using alpaca
  I want my grid fields to display correctly
  So that I can develop applications faster

  Scenario: Basic Grid Field
    Given I am on a page with a grid field
    When I wait 1 second
    Then I should see 8 "div" tags # ?
