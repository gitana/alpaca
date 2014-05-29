Feature: Add Array Item Feature
  As a user of alpaca
  I want to be able to add items to array fields
  So that I can increase the size of arrays

  Scenario: Add Item to Array Field
    Given I am on a page with an array field
    When I click on the array bar's add button
    Then I should see 4 input
