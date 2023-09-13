// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import the Cypress mochawesome reporter
import 'cypress-mochawesome-reporter/register'

// Anything in here runs before every spec file
beforeEach(() => {
  cy.clearAllCookies()
  cy.clearAllLocalStorage()
  cy.clearAllSessionStorage()

  /* Adds a cookie with the feature file path, this can be useful if a automated test generates an alert
   on a dashboard such as kibana, we will have a cookie pointing to the test that caused it and be able to attempt to reproduce it 
  */
  cy.setCookie('AutomatedTest:', Cypress.spec.relative)
})
