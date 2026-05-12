# Reflection

### 1. Hardest Bug
Managing the state of dynamic arrays within React Hook Form when using shadcn/ui components. Specifically, removing an item from the middle of the array caused the component below it to inherit the wrong state if keys were not explicitly mapped to the `field.id`.

### 2. Reversed Decision
Originally, I planned to use Supabase to store every single step of the form as "drafts". I reversed this decision and used `localStorage` (via Zustand persist) instead. This removed unnecessary network latency, reduced DB clutter, and aligned perfectly with the "value first, lead capture second" product philosophy.

### 3. Week 2 Roadmap
- **Week 2**: Implement OAuth login so users can return and track their savings over time.
- **Week 2**: Add an automated integration to directly connect to AWS/GCP billing APIs to pull spend automatically instead of manual input.
- **Week 2**: Build an admin dashboard for Credex sales reps to view the leads and generated summaries.

### 4. AI Usage Honesty
I heavily utilized AI coding assistants to scaffold the boilerplate, write the Tailwind utility classes, and generate the unit test stubs. However, the core business logic in the `audit-engine.ts` was carefully handcrafted and reviewed, as AI tends to hallucinate math and deterministic financial rules. The copy and GTM strategies were iteratively refined with AI brainstorming.

### 5. Self-Rating
**9.5/10**. The application is highly polished, production-ready, and functionally complete. The architecture is sound, and the product thinking aligns perfectly with a modern SaaS MVP. The only area for improvement would be adding actual E2E testing with Playwright, which was omitted for speed in this MVP phase.
