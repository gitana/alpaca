Feature: Display
  As a developer of a system using alpaca
  I want to be able to create simple text field inputs
  So that I can develop applications faster

  Scenario: Standard Text Field
    Given I am on a page with an any field
    Then I should see 1 "input" tag

  Scenario: Display Only Mode
    Given I am on a page with an any field with the value "Read Only" in display only mode
    Then I should see "Read Only"
