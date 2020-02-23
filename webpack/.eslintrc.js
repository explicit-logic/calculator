module.exports =  {
  "extends": "airbnb-base",
  // add your environment below the extends key, like this:
  "env": {
    "node": true,
  },
  "plugins": ["import"],
  "parserOptions": {
      "ecmaVersion": 6
  },
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  }
};
