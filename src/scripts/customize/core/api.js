import pluginApi from 'PWPcp';

// be sure to have what we need, bail otherwise
if (!pluginApi) {
  throw new Error('Missing crucial object `PWPcp`');
}

/** @type {Object} Collect here core components */
pluginApi.core = pluginApi.core || {};

/** @type {Object} Collect here controls, sections and panels prototypes */
pluginApi.controls = pluginApi.controls || {};
pluginApi.sections = pluginApi.sections || {};
pluginApi.panels = pluginApi.panels || {};

if (DEBUG) {
  window.api = pluginApi;
}

// exports Customize Plus API
export var api = pluginApi;
