import { describe, it, expect } from "vitest";
import { runAudit } from "../src/lib/audit-engine";
import { AuditContext } from "../src/types";

describe("Audit Engine", () => {
  it("detects over-spending on a standard plan", () => {
    const context: AuditContext = {
      primaryUseCase: "coding",
      teamSize: 1,
      tools: [
        {
          id: "1",
          tool: "Cursor",
          plan: "Pro",
          seats: 1,
          spend: 40, // Should be 20
          useCase: "coding",
        },
      ],
    };

    const result = runAudit(context);
    expect(result.totalSavings).toBe(20);
    expect(result.recommendations[0].action).toBe("Optimize Billing");
  });

  it("detects optimal spending", () => {
    const context: AuditContext = {
      primaryUseCase: "coding",
      teamSize: 1,
      tools: [
        {
          id: "1",
          tool: "Cursor",
          plan: "Pro",
          seats: 1,
          spend: 20, // Exactly 20
          useCase: "coding",
        },
      ],
    };

    const result = runAudit(context);
    expect(result.isOptimized).toBe(true);
    expect(result.totalSavings).toBe(0);
  });

  it("recommends downgrading Enterprise for small teams", () => {
    const context: AuditContext = {
      primaryUseCase: "coding",
      teamSize: 2,
      tools: [
        {
          id: "1",
          tool: "GitHub Copilot",
          plan: "Enterprise",
          seats: 2,
          spend: 78, // 39 * 2
          useCase: "coding",
        },
      ],
    };

    const result = runAudit(context);
    // Individual is $10/mo, so 2 seats = $20. 78 - 20 = 58
    expect(result.totalSavings).toBeGreaterThan(0);
    expect(result.recommendations[0].action).toBe("Downgrade Plan");
  });

  it("detects redundant coding assistants", () => {
    const context: AuditContext = {
      primaryUseCase: "coding",
      teamSize: 5,
      tools: [
        {
          id: "1",
          tool: "Cursor",
          plan: "Pro",
          seats: 5,
          spend: 100,
          useCase: "coding",
        },
        {
          id: "2",
          tool: "GitHub Copilot",
          plan: "Business",
          seats: 5,
          spend: 95,
          useCase: "coding",
        },
      ],
    };

    const result = runAudit(context);
    // Should keep the first one and suggest cancelling the second
    expect(result.recommendations[1].action).toBe("Cancel Tool");
    // total savings should be 95 + credex discount on the remaining 100
    expect(result.totalSavings).toBeGreaterThanOrEqual(95);
  });
  
  it("suggests Anthropic for coding API", () => {
    const context: AuditContext = {
      primaryUseCase: "coding",
      teamSize: 5,
      tools: [
        {
          id: "1",
          tool: "OpenAI API Direct",
          plan: "Variable",
          seats: 5,
          spend: 200,
          useCase: "coding",
        }
      ],
    };
    const result = runAudit(context);
    expect(result.recommendations[0].action).toBe("Switch Vendor");
  });
});
