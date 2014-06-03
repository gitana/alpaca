Feature: Display
  As a developer of a system using alpaca
  I want my file fields to display correctly
  So that I can develop applications faster

  Scenario: Basic Field
    Given I am on a page with a file field
    Then I should see 1 "input[type='file']" tag
