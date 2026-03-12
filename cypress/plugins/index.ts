/// <reference types="cypress" />

import registerCodeCoverageTasks from '@cypress/code-coverage/task';

const pluginConfig = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Cypress.PluginConfigOptions => {
  registerCodeCoverageTasks(on, config);
  return config;
};

export default pluginConfig;
