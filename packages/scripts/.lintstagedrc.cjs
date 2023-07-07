const path = require('path')

module.exports = {
  '*.{js,cjs,mjs,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
}
