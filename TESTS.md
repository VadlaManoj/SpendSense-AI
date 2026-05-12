# Testing Strategy

## Coverage
- `engine.test.ts`: Tests core pricing business logic.
- `components.test.tsx`: Tests rendering of the Audit Form.

## Commands
- `npm run test` (runs Vitest in watch mode)
- `npm run test:ci` (runs Vitest once)

## Core Test Cases
1. **Over-spend detection**: Inputting $30/mo for a $20/mo tool.
2. **Optimal spend detection**: Inputting exactly the expected price for the plan.
3. **Vendor downgrade**: Recommending Team ($30) instead of Enterprise for a team size of 3.
4. **Alternative recommendation**: Suggesting Anthropic API for coding tasks instead of OpenAI Direct API.
5. **Savings calculations**: Ensuring `currentSpend - recommendedSpend = savings` math is flawless.
