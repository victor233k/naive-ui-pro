import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'no-useless-call': 'off',
    'ts/no-namespace': 'off',
    'perfectionist/sort-exports': 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: false,
    }],
    'vue/max-attributes-per-line': ['error'],
  },
})
