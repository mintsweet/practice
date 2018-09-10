const eslintConfig = {
  globals: {
    $: true,
    document: true,
    window: true,
    jQuery: true
  },

  env: {
    mocha: true
  },

  extends: "mints",

  rules: {
    'no-var': 'off',
    'no-plusplus': 'off'
  }
};

module.exports = eslintConfig;
