Feature: Validation of Input
  As a developer of a system using alpaca
  I want to be able to create rules for validation
  So that I can help the user input the correct data

  Scenario: Length validation
    Given I am on a page with an alpacaForm with 2 any fields and a length restriction of 5
    Then I should see 2 "input" tags
    When I click on "input[name='a']" and type "Something longer than 5 characters"
      And click on "input[name='b']"
    Then the alpaca form should be invalid

  Scenario: Empty non required should be valid
    Given I am on a page with an any field
    Then the alpaca form should be valid
