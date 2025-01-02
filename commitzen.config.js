module.exports = {
  types: [
    { value: 'tooling', name: 'tooling: Add or update tooling' },
    { value: 'feat', name: 'feat:\tAdding a new feature' },
    { value: 'fix', name: 'fix:\tFixing a bug' },
    {
      value: 'style',
      name: 'style: Add or update styles',
    },
    {
      value: 'tests',
      name: 'test: Add or update tests',
    },
    {
      value: 'refactor',
      name: 'refactor: Code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'perf',
      name: 'Code change that improves performance',
    },
    {
      value: 'test',
      name: 'test: Adding tests cases / adds missing tests',
    },
    {
      value: 'chore',
      name: 'chore: Changes to the build process or auxiliary tools and libraries such as documentation generation',
    },
    { value: 'revert', name: 'revert:\tRevert to a commit' },
  ],
  scopes: [
    { name: 'backend' },
    { name: 'infrastructure' },
    { name: 'documentation' },
    { name: 'ci' },
    { name: 'tests' },
    { name: 'tooling' },
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'perf', 'refactor'],
  subjectLimit: 100,
  skipQuestions: ['body'],
};
