const eslintConfig = {
  env: {
    jest: true,
    mocha: true,
    jquery: true
  },

  globals: {
    window: true,
    document: true,
  },

  extends: 'mints',
};

module.exports = eslintConfig;
