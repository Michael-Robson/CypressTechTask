const { defineConfig } = require('cypress')
const webpack = require('@cypress/webpack-preprocessor')
const preprocessor = require('@badeball/cypress-cucumber-preprocessor')

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await preprocessor.addCucumberPreprocessorPlugin(on, config)
  require('cypress-mochawesome-reporter/plugin')(on),
    on(
      'file:preprocessor',
      webpack({
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.feature$/,
                use: [
                  {
                    loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                    options: config,
                  },
                ],
              },
            ],
          },
        },
      })
    )

  // Make sure to return the config object as it might have been modified by the plugin.
  return config
}

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/testReports',
    charts: true,
    reportPageTitle: 'Cypress E2E Suite',
    inline: true,
    inlineAssets: true,
    embeddedScreenshots: true,
  },
  e2e: {
    baseUrl: 'https://cms.demo.katalon.com/',
    specPattern: '**/*.feature',
    setupNodeEvents,
  },
})
