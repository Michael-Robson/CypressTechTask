// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Custom command that takes an element gets the href attribute from it and asserts it equals the passed in value
 */

/**
 * Looks for a link with the passed in text value and clicks it
 */
Cypress.Commands.add('clickLinkByText', (linkText) => {
  cy.get('a').contains(linkText).click()
})

/**
 * Asserts the current page url matches the passed in value
 */
Cypress.Commands.add('assertPageURL', (expectedURL) => {
  cy.url().then(($current) => {
    cy.log('URL is ' + $current)
    expect($current).to.include(expectedURL)
  })
})
