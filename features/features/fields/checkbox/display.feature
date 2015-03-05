Feature: Display
  As a developer of a system using alpaca
  I want my checkbox fields to display correctly
  So that I can develop applications faster

  Scenario: Checkbox field defaults to unchecked
    Given I am on a page with a checkbox field
    Then I should see 1 "input[type='checkbox']" tag
      And I should see 0 "input[type='checkbox']:checked" tags

  Scenario: Checkbox field with right label
    Given I am on a page with a checkbox field with { "options": { "rightLabel": "Right Label" } }
    Then I should see 1 "input" tag

  Scenario: Checkbox with comma-delimited data
    Given I am on a page with a checkbox field representing an enum
    Then I should see 4 "input" tags
      And I should see 3 "input:checked" tags
      And I should see 4 "label" tags
