"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowDown, ShieldAlert, Zap, Layers, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuditStore } from "@/store/audit-store";
import { runAudit } from "@/lib/audit-engine";
import { AuditResult } from "@/types";
import { LeadCapture } from "@/components/forms/LeadCapture";

export default function ResultPage() {
  const router = useRouter();
  const context = useAuditStore((state) => state.context);
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (context.tools.length === 0) {
      router.push("/audit");
      return;
    }
    const computed = runAudit(context);
    setResult(computed);
  }, [context, router]);

  if (!result) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><Zap className="h-8 w-8 text-primary animate-pulse" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary fill-primary" />
            <span className="font-bold text-xl tracking-tight text-white">SpendSense</span>
          </div>
          <Link href="/audit" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Edit Stack
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 mb-16 max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -z-10" />
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3 bg-[#050505] px-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s === 3 ? 'bg-accent text-[#050505] shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary text-white'}`}>
                {s === 3 ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              <span className={`text-sm ${s === 3 ? 'text-white' : 'text-gray-400'}`}>
                {s === 1 ? 'Configure Stack' : s === 2 ? 'AI Analysis' : 'Results'}
              </span>
            </div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          {result.totalSavings > 0 ? (
            <div className="bg-[#111] border border-white/5 rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium mb-6 text-sm">
                <CheckCircle2 className="h-4 w-4" /> Optimization Found
              </div>
              <h1 className="text-6xl md:text-[5rem] font-extrabold tracking-tight mb-4">
                Save <span className="text-accent drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">${result.totalSavings}</span> / mo
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mx-auto">
                That's <strong className="text-white">${result.totalSavings * 12}</strong> back in your startup's runway every year.
              </p>
            </div>
          ) : (
            <div className="bg-[#111] border border-white/5 rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium mb-6 text-sm">
                <ShieldAlert className="h-4 w-4" /> Fully Optimized
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
                Your stack is efficient.
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mx-auto">
                We didn't find any obvious redundancies in your stack. Great job!
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" /> Action Plan
            </h2>
            <div className="space-y-4">
              {result.recommendations.map((rec, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  key={i} 
                  className={`border ${rec.savings > 0 ? "border-accent/30 bg-[#111] shadow-[0_0_15px_rgba(34,197,94,0.05)]" : "border-white/5 bg-[#0a0a0a]"} rounded-xl p-6 relative overflow-hidden`}
                >
                  {rec.savings > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />}
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{rec.toolName}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${rec.savings > 0 ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                          {rec.action}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{rec.reason}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-[#050505] p-4 rounded-lg border border-white/5 shrink-0 self-start md:self-center">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Current</p>
                        <p className="text-lg font-semibold text-gray-500 line-through">${rec.currentSpend}</p>
                      </div>
                      <ArrowDown className={`h-5 w-5 ${rec.savings > 0 ? 'text-accent' : 'text-gray-600'}`} />
                      <div className="text-left">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Optimized</p>
                        <p className={`text-xl font-bold ${rec.savings > 0 ? 'text-accent' : 'text-white'}`}>${rec.recommendedSpend}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <LeadCapture result={result} context={context} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
