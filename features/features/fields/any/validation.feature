Feature: Validation of Input
  As a developer of a system using alpaca
  I want to be able to create rules for validation
  So that I can help the user input the correct data

  Scenario: Length validation
    Given I am on a page with an any field that has a max length of 5
    Then I should see 1 "input" tag
    When I click on "input" and type "Something longer than 5 characters"
      And click on "#click-off"
    Then the alpaca form should be invalid

  Scenario: Empty non required should be valid
    Given I am on a page with an any field
    Then the alpaca form should be valid
