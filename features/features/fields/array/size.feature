Feature: Manipulate Array Size
  As a user of alpaca
  I want to be able to add and remove items to array fields
  So that I can change the size of arrays

  Scenario: Add Item to Array Field
    Given I am on a page with an array field with 3 elements
    When I click on the array bar's add button
    Then I should see 4 "input" tags

  Scenario: Remove Item from Array Field
    Given I am on a page with an array field with 3 elements
    When I click on the array bar's remove button
    Then I should see 2 "input" tags
