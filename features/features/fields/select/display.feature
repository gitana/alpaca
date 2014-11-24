Feature: Display
  As a developer of a system using alpaca
  I want my select fields to display correctly
  So that I can develop applications faster

  Scenario: Radio Field
    Given I am on a page with a select field
    Then I should see 1 "select" tag
      And there should be 6 "option" tags

  Scenario: Helper
    Given I am on a page with a select field
    Then I should see "Guess my favorite ice cream?"
