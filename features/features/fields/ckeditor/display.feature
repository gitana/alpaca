Feature: Display
  As a developer of a system using alpaca
  I want my ckeditor fields to display correctly
  So that I can develop applications faster

  Scenario: CKEditor Field
    Given I am on a page with a ckeditor field
    Then I should see 1 ".cke" tag
