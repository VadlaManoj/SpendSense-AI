import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuditContext, AuditResult } from '@/types';

interface AuditState {
  context: AuditContext;
  result: AuditResult | null;
  setContext: (context: AuditContext) => void;
  setResult: (result: AuditResult) => void;
  reset: () => void;
}

const defaultContext: AuditContext = {
  tools: [],
  teamSize: 1,
  primaryUseCase: 'mixed',
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      context: defaultContext,
      result: null,
      setContext: (context) => set({ context }),
      setResult: (result) => set({ result }),
      reset: () => set({ context: defaultContext, result: null }),
    }),
    {
      name: 'credex-audit-storage',
    }
  )
);
