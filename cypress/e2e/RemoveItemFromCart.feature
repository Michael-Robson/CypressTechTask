Feature: Cypress Task
    Scenario: Verify items can be added & removed from the cart
        Given I add <NumItemsToAdd> random items to my cart
        When I view my cart
        Then I find a total of <NumItemsToAdd> items listed in my cart
        When I search for the lowest priced item
        Then I remove the lowest priced item from my cart
        Then I find a total of <ExpectedNumItems> items listed in my cart

        Examples:
            | NumItemsToAdd | ExpectedNumItems |
            | 4             | 3                |
            | 5             | 4                |
            | 2             | 1                |