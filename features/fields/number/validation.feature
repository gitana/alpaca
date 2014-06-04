Feature: Validation of Input
  As a developer of a system using alpaca
  I want to be able to create rules for validation
  So that I can help the user input the correct data

  Scenario: Number fields should only allow numbers to be entered
    Given I am on a page with an alpacaForm with two number fields
    When I click on "input[name='a']" and type "Not numbers"
      And I click on "input[name='b']"
    Then the alpaca form should be invalid
