import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base recommended JavaScript rules
  eslint.configs.recommended,
  // Recommended TypeScript rules
  ...tseslint.configs.recommended,
  {
    // Tell ESLint to ignore build output and node_modules
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  {
    rules: {
      // Keep these as warnings so they don't break the CI, but remind you to fix them eventually
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Turn these off completely for the backend
      'no-console': 'off', 
      '@typescript-eslint/no-namespace': 'off',
      
      // Temporarily downgrade unused variables to a warning so you can merge your current work
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  }
);