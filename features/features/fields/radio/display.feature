Feature: Display
  As a developer of a system using alpaca
  I want my radio fields to display correctly
  So that I can develop applications faster

  Scenario: Radio Field
    Given I am on a page with a radio field
    Then I should see 3 "input[type='radio']" tags

  Scenario: Helper
    Given I am on a page with a radio field
    Then I should see "Guess my favorite ice cream?"
