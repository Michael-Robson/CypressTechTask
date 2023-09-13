class CartPage {
  constructor() {
    // URL and selectors found using different css search types
    this.url = '/cart/'
    this.cartItems = "tr[class='woocommerce-cart-form__cart-item cart_item']"
    this.quantities = this.cartItems + ' td.product-quantity'
    this.individualPrices =
      "td[data-title='Price'] span[class='woocommerce-Price-amount amount']"
    this.itemTotals = "td[data-title='Total']"
    this.productNames = "td[data-title='Product']"
    this.productThumbnails = 'td.product-thumbnail'
    this.productRemoveButtons = 'td.product-remove a'
    this.undoLink = "a[class='restore-item']"
  }

  /**
   * Navigates to the cart page
   */
  visit() {
    cy.visit(this.url)
  }

  /**
   * Asserts the number of items currently in the cart matches the number provided
   * @param {*} expected
   */
  assertNumberOfItemsInCart(expected) {
    cy.get(this.cartItems).should('have.length', expected)
  }

  /**
   * Loops through the cart looking for the lowest priced item and wraps it up as @lowestPricedItem
   * so it can be reused in another step to do things like assert the price, check the qty or click the delete button
   */
  getLowestPricedItem() {
    // We will store all the prices in an array
    const prices = []

    // Step 1 Get all the prices and loop through them
    cy.get(this.individualPrices).each(($prices) => {
      // Step 2 Remove any non-numeric or . characters so that you are left with numbers
      const priceText = $prices
        .text()
        .trim()
        .replace(/[^0-9.]/g, '')

      // Step 3 Convert the price string to a float
      const priceValue = parseFloat(priceText)

      // Step 4 Add the converted prices to the array
      prices.push(priceValue)
    })

    // Step 5 Now we have an array of prices we will sort them so the lowest is first
    // Using cy.then because of async we need to ensure this only happens after the .each otherwise the arrays would be empty
    cy.then(() => {
      // Slice (duplicate) the prices array
      const sorted = [...prices]

      // Simple sort to order them in ascending order
      sorted.sort(function (a, b) {
        return a - b // Compare numbers, ascending order
      })

      // Would usually remove log lines but for this task it's useful to see the array is sorted
      cy.log('Original Order: ', prices)
      cy.log('Sorted Order: ', sorted)

      // Now sorted is in ascending order we know the first number in the array is the smallest so get the position of that number in the unsorted array
      const index = prices.indexOf(sorted[0])
      cy.log('In the original array ' + sorted[0] + ' is at position ' + index)

      // Wrap up the position of the lowest priced item, we can then use that in our removeNthItemFromCart function to click the correct delete button
      cy.wrap(index).as('lowestPricedItem')
    })
  }

  /**
   * Removes the item in position {index} from the cart
   * @param {*} index
   */
  removeNthItemFromCart(index) {
    // Intercept the API so we don't move on before we are sure the item is removed and the cart is refreshed
    cy.intercept('POST', '/?wc-ajax=get_refreshed_fragments').as('removedItem')

    // Click the remove button at the given index
    cy.get(this.productRemoveButtons).eq(index).click()

    // Wait until we get a 200 back from the API now we know the item was removed and the cart refreshed
    cy.wait('@removedItem').its('response.statusCode').should('eq', 200)

    // Assert we have the undo link present as an extra check
    cy.get(this.undoLink).should('be.visible')
  }
}

export { CartPage }
