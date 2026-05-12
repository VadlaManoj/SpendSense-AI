# User Interviews

### Interview 1: Sarah T. (CTO, Series A Startup)
**Quote**: "I have no idea what my devs are using. Half are expensing ChatGPT Plus, half are on Copilot, and one guy is running a massive Anthropic API bill on a rogue side project."
**Surprises**: She didn't realize GitHub Copilot Enterprise was double the cost of Business without adding much value for their specific workflow.
**Design Changes**: Added a "Consolidate Billing" recommendation to the audit engine specifically for this scenario.

### Interview 2: Mark D. (Founder, Bootstrapped)
**Quote**: "I want to save money, but I don't want to hop on a sales call just to see a generic PDF."
**Surprises**: High aversion to lead-gen gates. 
**Design Changes**: Moved the email capture strictly *after* the audit results are shown. Provide immediate value, ask for email later.

### Interview 3: Elena R. (VP Engineering, Seed Stage)
**Quote**: "We use both Cursor and Copilot. Is that redundant? I honestly don't know."
**Surprises**: Lack of clarity on feature overlap between AI code assistants.
**Design Changes**: Added logic to flag when both Cursor and Copilot are used by the same team, recommending settling on one to cut costs in half.
