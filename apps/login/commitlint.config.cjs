module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['Feat', 'Fix', 'Doc', 'Style', 'Update', 'Refactor', 'Test', 'Framework', 'Revert'],
    ],
    'type-case': [0, 'always', 'start-case'],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
};
