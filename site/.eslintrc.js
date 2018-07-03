const eslintConfig = {
  globals: {
    $: true,
    document: true,
    window: true,
    alert: true
  },

  extends: "mints",

  rules: {
    'no-console': 'off',
    'no-var': 'off',
    'no-plusplus': 'off'
  }
};

module.exports = eslintConfig;
