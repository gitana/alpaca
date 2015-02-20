Feature: Toggle display of array inside object fields
  As a user of a system using alpaca
  I want to be able to hide some array fields
  So that it can be easier for me to ender data

  Scenario: I should be able toggle visibility of array fields by clicking on their title
    Given I am on a page with an array field with { "schema": { "title": "Array Field", "type": "array" }, "data": "test" }
    When I click on the text "Array Field"
      And after 1 second # give the animation some time to play out
    Then I should see 0 "input" tags

  Scenario: I should be able toggle visibility of nested array fields by clicking on their title
    Given I am on a page with an array field with {"data":[{"params":[{"name":"test"}]}],"schema":{"title":"Outer Array Field","type":"array","items":{"type":"object","properties":{"params":{"title":"Nested Array Field","type":"array","items":{"type":"object","properties":{"name":{"title":"Name","type":"string"}}}}}}}}

    When I click on the text "Nested Array Field"
      And after 1 second # give the animation some time to play out
    Then I should see the text "Outer Array Field"
    And I should see the text "Nested Array Field"

    When I click on the text "Outer Array Field"
      And after 1 second # give the animation some time to play out
    Then I should see the text "Outer Array Field"
    And I should not see the text "Nested Array Field"
