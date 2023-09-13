class HomePage {
  constructor() {
    // URL and selectors
    this.url = '/'
    this.products = "ul[class='products columns-3']"
    this.productImages = this.products + ' li img'
    this.addToCartButtons = this.products + " li div [href*='?']"
    this.viewCartNotifications = "a[title='View cart']"
  }

  /**
   * Navigates to the home page
   */
  visit() {
    cy.visit(this.url)
  }

  /**
   * Adds the given number of items to the cart
   * @param {} numItems
   */
  addRandomItemsToCart(numItems) {
    // First make sure we have enough items on the page
    cy.get(this.addToCartButtons)
      .should('have.length.at.least', numItems)
      .then(($buttons) => {
        // Now we know we have enough unique items we can start adding to the cart

        // Step 1 Get {numItems} random $button indexes
        const indicies = []
        while (indicies.length < numItems) {
          const randomIndex = Math.floor(Math.random() * $buttons.length)
          // Only add this index to the array if it's not already present so we don't add the same product multiple times
          if (!indicies.includes(randomIndex)) {
            indicies.push(randomIndex)
          }
        }

        // Index now contains an array of {numItems} random number, each value of which relates to a random add to bag button on the page

        // Step 2 Click the add to basket buttons
        indicies.forEach((index) => {
          // Intercept the AJAX POST to ?wc-ajax=add_to_cart
          cy.intercept('POST', '/?wc-ajax=add_to_cart').as('addedItem')

          // Clicks the add to cart button
          cy.wrap($buttons.eq(index)).click()

          // Step 3 before the next click check the AJAX response is a 200 - this will ensure we don't go too fast
          cy.wait('@addedItem').its('response.statusCode').should('eq', 200)
        })
      })
  }
}

export { HomePage }
