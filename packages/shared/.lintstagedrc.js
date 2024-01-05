module.exports = {
  '*.{js,cjs,mjs,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{css,scss}': ['prettier --write', 'stylelint --fix'],
}
