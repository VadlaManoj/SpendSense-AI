import { AuditContext, AuditResult, Recommendation, ToolInput } from "@/types";
import { getExpectedPrice } from "./pricing-data";

export function runAudit(context: AuditContext): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalCurrentSpend = 0;
  let totalRecommendedSpend = 0;

  const codingAssistants = context.tools.filter(t => 
    ["Cursor", "GitHub Copilot", "Windsurf"].includes(t.tool)
  );
  let consolidatedCodingAssistant = false;

  const chatAssistants = context.tools.filter(t => 
    ["ChatGPT", "Claude", "Gemini"].includes(t.tool) && !t.plan.includes("API")
  );
  let consolidatedChatAssistant = false;

  for (const tool of context.tools) {
    totalCurrentSpend += tool.spend;
    let recommendedSpendForTool = tool.spend;
    let savings = 0;
    let reason = "Your spend on this tool appears optimal.";
    let action = "Keep";

    const expectedPrice = getExpectedPrice(tool.tool, tool.plan);

    if (expectedPrice !== null && expectedPrice > 0) {
      const expectedTotal = expectedPrice * tool.seats;
      if (tool.spend > expectedTotal) {
        savings = tool.spend - expectedTotal;
        recommendedSpendForTool = expectedTotal;
        reason = `You are paying $${tool.spend}/mo, but the expected cost for ${tool.seats} seats on the ${tool.plan} plan is $${expectedTotal}/mo.`;
        action = "Optimize Billing";
      }
    }

    if ((tool.plan === "Enterprise" || tool.plan === "Team") && tool.seats < 5 && tool.tool !== "Claude" && tool.tool !== "ChatGPT") {
      const proPrice = getExpectedPrice(tool.tool, "Pro") || getExpectedPrice(tool.tool, "Individual") || getExpectedPrice(tool.tool, "Premium");
      if (proPrice !== null) {
        const potentialTotal = proPrice * tool.seats;
        if (potentialTotal < recommendedSpendForTool) {
          savings = tool.spend - potentialTotal;
          recommendedSpendForTool = potentialTotal;
          reason = `For a team of ${tool.seats}, an Enterprise/Team plan is likely overkill. Downgrading to a Pro/Individual tier could save money while retaining necessary features.`;
          action = "Downgrade Plan";
        }
      }
    }

    if (codingAssistants.length > 1 && ["Cursor", "GitHub Copilot", "Windsurf"].includes(tool.tool)) {
      if (codingAssistants[0].id !== tool.id) {
        savings = recommendedSpendForTool;
        recommendedSpendForTool = 0;
        reason = `You are paying for multiple AI coding assistants (${codingAssistants.map(t=>t.tool).join(", ")}). Standardizing on one will eliminate redundancy.`;
        action = "Cancel Tool";
      }
    }

    if (chatAssistants.length > 1 && ["ChatGPT", "Claude", "Gemini"].includes(tool.tool) && !tool.plan.includes("API")) {
      if (chatAssistants[0].id !== tool.id) {
        savings = recommendedSpendForTool;
        recommendedSpendForTool = 0;
        reason = `You have multiple general purpose AI subscriptions. Standardizing on a single provider (like Claude or ChatGPT) for the whole team is usually sufficient.`;
        action = "Cancel Tool";
      }
    }

    if (tool.tool === "OpenAI API Direct" && context.primaryUseCase === "coding") {
      reason = "For coding tasks, Anthropic's Claude 3.5 Sonnet API often performs better and can be more cost-effective than OpenAI's GPT-4o.";
      action = "Switch Vendor";
    }

    totalRecommendedSpend += recommendedSpendForTool;

    recommendations.push({
      toolId: tool.id,
      toolName: tool.tool,
      currentSpend: tool.spend,
      recommendedSpend: recommendedSpendForTool,
      savings: savings,
      reason,
      action
    });
  }

  let totalSavings = totalCurrentSpend - totalRecommendedSpend;

  if (totalSavings > 0 || totalCurrentSpend > 500) {
     const credexSavings = totalRecommendedSpend * 0.15;
     if (credexSavings > 50) {
       recommendations.push({
         toolId: "spendsense-credits",
         toolName: "AI Infrastructure Credits",
         currentSpend: totalRecommendedSpend,
         recommendedSpend: totalRecommendedSpend - credexSavings,
         savings: credexSavings,
         reason: "SpendSense can provide startup credits and volume discounts across major AI providers (AWS, GCP, Anthropic, OpenAI), instantly reducing your optimized bill.",
         action: "Get SpendSense Credits"
       });
       totalSavings += credexSavings;
       totalRecommendedSpend -= credexSavings;
     }
  }

  totalSavings = Math.round(totalSavings * 100) / 100;
  totalRecommendedSpend = Math.round(totalRecommendedSpend * 100) / 100;
  totalCurrentSpend = Math.round(totalCurrentSpend * 100) / 100;

  return {
    totalCurrentSpend,
    totalRecommendedSpend,
    totalSavings,
    recommendations,
    isOptimized: totalSavings === 0
  };
}
