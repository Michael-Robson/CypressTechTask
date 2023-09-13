import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { HomePage } from '../../pages/homePage'
import { CartPage } from '../../pages/cartPage'

// Decalre the page objects we will be using in these steps
let homePage
let cartPage

// Before every test create instances of the page object and go to the home page
beforeEach(() => {
  // create instance of the page objects
  homePage = new HomePage()
  cartPage = new CartPage()

  // Navigate to the home page
  homePage.visit()
})

Given('I add {int} random items to my cart', function (numItems) {
  // Calls the home function to add x items to the cart
  homePage.addRandomItemsToCart(numItems)
})

When('I view my cart', () => {
  // Use custom command defined in commands.js that clicks a link by it's link text
  cy.clickLinkByText('Cart')

  // Assert we are taken to the correct page
  cy.assertPageURL(cartPage.url)
})

Then(
  'I find a total of {int} items listed in my cart',
  function (expectedCartTotal) {
    // Asserts we have the correct number of items in the cart
    cartPage.assertNumberOfItemsInCart(expectedCartTotal)
  }
)

When('I search for the lowest priced item', () => {
  // Gets the lowest priced item in the cart and wraps it up as 'lowestPricedItem' for use later
  cartPage.getLowestPricedItem()
})

Then('I remove the lowest priced item from my cart', () => {
  // Get the 'lowestPricedItem' object we created in the previous step
  cy.get('@lowestPricedItem').then((index) => {
    // Calls the function that removes the item from the cart based on it's position in the bag
    cartPage.removeNthItemFromCart(index)
  })
})
