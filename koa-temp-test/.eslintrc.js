const eslintConfig = {
  env: {
    mocha: true,
    node: true
  },
  
  extends: 'D:/study/mints/packages/eslint-config-mints/index.js',

  rules: {
    'no-return-assign': 'off'
  }
};

module.exports = eslintConfig;
