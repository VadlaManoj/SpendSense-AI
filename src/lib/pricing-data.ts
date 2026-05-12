export const PRICING_DB = {
  "Cursor": {
    "Hobby": 0,
    "Pro": 20,
    "Business": 40,
    "Enterprise": null
  },
  "GitHub Copilot": {
    "Individual": 10,
    "Business": 19,
    "Enterprise": 39
  },
  "Claude": {
    "Free": 0,
    "Pro": 20,
    "Max": 40,
    "Team": 30,
    "Enterprise": null,
    "API Direct": null
  },
  "ChatGPT": {
    "Free": 0,
    "Plus": 20,
    "Team": 30,
    "Enterprise": null,
    "API Direct": null
  },
  "Anthropic API Direct": {
    "Variable": null
  },
  "OpenAI API Direct": {
    "Variable": null
  },
  "Gemini": {
    "Free": 0,
    "Pro": 20,
    "Ultra": 20,
    "API": null
  },
  "Windsurf": {
    "Free": 0,
    "Pro": 20,
    "Team": 40,
    "Enterprise": null
  },
  "v0": {
    "Free": 0,
    "Premium": 20,
    "Team": 30
  }
} as const;

export type ToolName = keyof typeof PRICING_DB;
export const TOOLS = Object.keys(PRICING_DB) as ToolName[];

export function getExpectedPrice(tool: string, plan: string): number | null {
  if (tool in PRICING_DB) {
    const plans = PRICING_DB[tool as ToolName];
    if (plan in plans) {
      return (plans as Record<string, number | null>)[plan];
    }
  }
  return null;
}
