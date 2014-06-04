Feature: Validation of Input
  As a developer of a system using alpaca
  I want to be able to create rules for validation
  So that I can help the user input the correct data

  Scenario: Number fields should only allow numbers to be entered
    Given I am on a page with a number field
    When I click on "input" and type "Not numbers"
      And I click on "#click-off"
    Then the alpaca form should be invalid
