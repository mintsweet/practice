const eslintConfig = {
  env: {
    jest: true,
    mocha: true,
    jquery: true
  },

  globals: {
    document: true
  },

  extends: 'mints',
};

module.exports = eslintConfig;
