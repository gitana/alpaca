Feature: Display
  As a developer of a system using alpaca
  I want my country fields to display correctly
  So that I can develop applications faster

  Scenario: Country Field
    Given I am on a page with a country field
    Then I should see 1 "select" tag
      And there should be at least 1 "option" tag
