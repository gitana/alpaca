Feature: Hide Init Validation Error
  As a developer using alpaca
  I want to be able to hide some initial validation errors
  So that users don't get confused

  Scenario: If the form is invalid then it should be detected, just not displayed
    Given I am on a page with required fields and the hideInitValidationError flag on
    Then the alpaca form should be invalid

  Scenario: Errors should not be shown right after the form is initialized
    Given I am on a page with required fields and the hideInitValidationError flag on
    Then I should see 0 ".alpaca-invalid" tags

  Scenario: If the form is changed and is still invalid then errors should be shown
    Given I am on a page with required fields and the hideInitValidationError flag on
    When I click on "input[name='required']"
      And I click on "#click-off"
    Then I should see at least 1 ".alpaca-invalid" tag
