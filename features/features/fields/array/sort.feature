Feature: Order array elements
  As a user of alpaca
  I want to be able to change the order of elements in arrays
  So that I can properly input my data

  Scenario: Move en element down
    Given I am on a page with an array field with the data ["foo", "bar", "baz"]
    When I click on the array bar's down button
      And after 1 second # give the animation some time to play out
    Then the first "input" tag's value should be "bar"

  Scenario: Attempt to move the first element up
    Given I am on a page with an array field with the data ["foo", "bar", "baz"]
    When I click on the array bar's up button
      And after 1 second # give the animation some time to play out
    # the value does not change because the first elemnt can't move up
    Then the first "input" tag's value should be "foo"

  Scenario: Move en element up
    Given I am on a page with an array field with the data ["foo", "bar", "baz"]
    When I click on the array bar's second up button
      And after 1 second # give the animation some time to play out
    Then the first "input" tag's value should be "bar"
