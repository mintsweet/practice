const eslintConfig = {
  env: {
    mocha: true,
    jquery: true
  },

  globals: {
    document: true
  },

  extends: 'mints',
};

module.exports = eslintConfig;
