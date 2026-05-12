# Product Metrics

**North Star Metric**: Total identified savings ($) per month. 
*Why?* This perfectly aligns customer value with our business goals. The more savings we find, the more likely they are to trust Credex with their infrastructure billing.

**3 Input Metrics**:
1. **Audit Completion Rate**: (Audits Completed / Landing Page Visitors). Target: >15%.
2. **Savings Discovery Rate**: % of audits that identify >$100 in monthly savings. Target: >40%.
3. **Lead Capture Rate**: (Emails Captured / Audits Completed). Target: >20%.

**Instrumentation**:
- Vercel Web Analytics for basic traffic and bounce rates.
- Custom events tracked in Supabase (e.g., `audit_started`, `audit_completed`, `savings_found`).

**Pivot Trigger**:
If the **Savings Discovery Rate** falls below 15% after 500 audits, it means startups are already highly optimized and our core value proposition is weak. We will pivot from an "Audit" tool to an "AI ROI Calculator" to help them justify the spend rather than cut it.
