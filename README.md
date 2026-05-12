# AI Spend Audit

## Product Summary
A Next.js SaaS application that helps startups and engineering teams audit their AI tools spend, identifies waste, calculates potential savings, and captures high-value leads for Credex.

## Target Users
- Startup Founders
- Engineering Managers
- CTOs

## Setup Steps
1. `npm install`
2. Create `.env.local` and add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`
3. `npm run dev`

## Deployment Steps
1. Push to GitHub
2. Connect to Vercel
3. Add Environment Variables
4. Deploy

## 5 Engineering Tradeoffs
1. **Local Storage vs DB for Drafts**: We use `localStorage` for form persistence to avoid unnecessary DB writes and auth friction before value is shown.
2. **Next.js App Router vs Pages**: App Router allows Server Actions for secure API logic without separate endpoint files.
3. **Hardcoded Pricing vs DB**: Pricing rules are deterministic and hardcoded because vendor pricing rarely changes and it avoids DB lookup latency for core logic.
4. **Zustand vs React Context**: Zustand provides simpler global state for the multi-step form without provider wrapping overhead.
5. **Anthropic API vs OpenAI**: Anthropic (Claude 3.5 Sonnet) is preferred for better nuanced writing and personalization in the audit summary.

## Deployed URL
[Placeholder URL](https://credex-spend-audit.vercel.app)
