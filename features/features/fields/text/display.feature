Feature: Display
  As a developer of a system using alpaca
  I want my text fields to display correctly
  So that I can develop applications faster

  Scenario: Text Field
    Given I am on a page with a text field
    Then I should see 1 "input[type='text']" tag
