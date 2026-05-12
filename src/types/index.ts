import { z } from "zod";

export const UseCaseSchema = z.enum(["coding", "writing", "data", "research", "mixed"]);
export type UseCase = z.infer<typeof UseCaseSchema>;

export const ToolInputSchema = z.object({
  id: z.string(),
  tool: z.string().min(1, "Tool name is required"),
  plan: z.string().min(1, "Plan is required"),
  spend: z.number().min(0, "Spend must be 0 or greater"),
  seats: z.number().min(1, "At least 1 seat is required"),
  useCase: UseCaseSchema,
});

export type ToolInput = z.infer<typeof ToolInputSchema>;

export const AuditContextSchema = z.object({
  tools: z.array(ToolInputSchema),
  teamSize: z.number().min(1),
  primaryUseCase: UseCaseSchema,
});

export type AuditContext = z.infer<typeof AuditContextSchema>;

export type Recommendation = {
  toolId: string;
  toolName: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  reason: string;
  action: string;
};

export type AuditResult = {
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalSavings: number;
  recommendations: Recommendation[];
  isOptimized: boolean;
};
