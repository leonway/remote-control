const { override } = require('customize-cra')

function addRendererTarget(config) {
  config.target = 'electron-renderer'
  return config
}
const a = {}

module.exports = override(addRendererTarget)
