"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, Layers, Users, Activity, Database, ChevronLeft, Zap } from "lucide-react";
import Link from "next/link";
import { AuditContextSchema, type AuditContext } from "@/types";
import { TOOLS, PRICING_DB, ToolName } from "@/lib/pricing-data";
import { useAuditStore } from "@/store/audit-store";

export function AuditForm() {
  const router = useRouter();
  const setContext = useAuditStore((state) => state.setContext);
  const existingContext = useAuditStore((state) => state.context);
  const [step, setStep] = useState<1 | 2>(1);
  const [progress, setProgress] = useState(0);

  const form = useForm<AuditContext>({
    resolver: zodResolver(AuditContextSchema),
    defaultValues: existingContext.tools.length > 0 ? existingContext : {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        {
          id: Math.random().toString(36).substring(7),
          tool: "Claude",
          plan: "Pro",
          spend: 20,
          seats: 1,
          useCase: "coding",
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  const onSubmit = async (data: AuditContext) => {
    setContext(data);
    setStep(2);
  };

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            router.push("/result");
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, router]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary fill-primary" />
          <span className="font-bold text-xl tracking-tight text-white">SpendSense</span>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      <div className="flex items-center justify-center gap-4 mb-16 max-w-2xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3 bg-[#050505] px-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'border border-white/20 text-gray-500'}`}>
              {s}
            </div>
            <span className={`text-sm ${step >= s ? 'text-white' : 'text-gray-500'}`}>
              {s === 1 ? 'Configure Stack' : s === 2 ? 'AI Analysis' : 'Results'}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Configure Your AI Stack</h1>
              <p className="text-gray-400">Add all the AI tools your team currently pays for.</p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm text-gray-400 font-medium">Total Engineering Team Size</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min={1} 
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      {...form.register("teamSize", { valueAsNumber: true })} 
                    />
                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-gray-400 font-medium">Primary Use Case</label>
                  <select 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    {...form.register("primaryUseCase")}
                  >
                    <option value="coding">Coding / Engineering</option>
                    <option value="writing">Writing / Content</option>
                    <option value="data">Data Analysis</option>
                    <option value="research">Research</option>
                    <option value="mixed">Mixed / General</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Your AI Subscriptions</h2>
                <button 
                  type="button" 
                  onClick={() => append({ id: Math.random().toString(), tool: "Cursor", plan: "Pro", spend: 20, seats: 1, useCase: "coding" })}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Tool
                </button>
              </div>

              <AnimatePresence>
                {fields.map((field, index) => {
                  const currentTool = form.watch(`tools.${index}.tool`) as ToolName;
                  const availablePlans = currentTool && PRICING_DB[currentTool] ? Object.keys(PRICING_DB[currentTool]) : [];

                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center bg-[#111] border border-white/5 rounded-xl p-4 overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                          <Layers className="h-4 w-4 text-primary" />
                        </div>
                        <select className="bg-transparent text-white font-semibold focus:outline-none w-full" {...form.register(`tools.${index}.tool`)} onChange={(e) => { form.setValue(`tools.${index}.tool`, e.target.value); const firstPlan = Object.keys(PRICING_DB[e.target.value as ToolName] || {})[0]; if(firstPlan) form.setValue(`tools.${index}.plan`, firstPlan); }}>
                          {TOOLS.map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
                        </select>
                        <select className="bg-[#222] text-xs text-gray-300 py-1 px-2 rounded-md focus:outline-none" {...form.register(`tools.${index}.plan`)}>
                          {availablePlans.map(p => <option key={p} value={p} className="bg-[#111]">{p}</option>)}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Seats</span>
                        <input type="number" min={1} className="bg-transparent text-white focus:outline-none w-16 border-b border-transparent hover:border-white/20 focus:border-primary px-1" {...form.register(`tools.${index}.seats`, { valueAsNumber: true })} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Monthly Spend</span>
                        <div className="flex items-center text-white">
                          $<input type="number" min={0} className="bg-transparent focus:outline-none w-20 ml-1 border-b border-transparent hover:border-white/20 focus:border-primary px-1" {...form.register(`tools.${index}.spend`, { valueAsNumber: true })} />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Use Case</span>
                        <select className="bg-transparent text-white text-sm focus:outline-none" {...form.register(`tools.${index}.useCase`)}>
                          <option value="coding" className="bg-[#111]">Coding</option>
                          <option value="writing" className="bg-[#111]">Writing</option>
                          <option value="data" className="bg-[#111]">Data</option>
                          <option value="mixed" className="bg-[#111]">Mixed</option>
                        </select>
                      </div>

                      <button type="button" onClick={() => remove(index)} className="text-gray-500 hover:text-red-500 transition-colors p-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="pt-8 flex justify-center">
              <button 
                type="submit" 
                className="bg-primary text-white rounded-full px-12 py-4 font-bold text-lg hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center gap-2 disabled:opacity-50"
                disabled={fields.length === 0}
              >
                Analyze My Stack <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your AI Stack</h2>
            <p className="text-gray-400 mb-16">Our AI agents are scanning pricing, usage, and team patterns...</p>

            <div className="relative w-64 h-64 mb-16">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 relative animate-pulse">
                    <div className="absolute inset-0 bg-primary/40 rotate-45 blur-xl"></div>
                    <div className="absolute inset-2 bg-accent/40 rotate-45 blur-xl"></div>
                    <div className="w-full h-full border border-primary/50 rotate-45 bg-[#111]/80 backdrop-blur-sm flex items-center justify-center shadow-[inset_0_0_20px_rgba(124,58,237,0.5)]">
                       <Zap className="h-10 w-10 text-white" />
                    </div>
                 </div>
              </div>

              <div className="absolute -left-32 top-0 bg-[#111] border border-white/5 rounded-lg p-3 flex items-center gap-3 animate-bounce shadow-lg" style={{ animationDelay: "0s" }}>
                 <Database className="h-5 w-5 text-gray-400" />
                 <div className="text-left"><p className="text-sm font-bold text-white">Pricing Database</p><p className="text-[10px] text-gray-500">Scanning 50,000+ plans</p></div>
              </div>
              <div className="absolute -right-32 top-0 bg-[#111] border border-white/5 rounded-lg p-3 flex items-center gap-3 animate-bounce shadow-lg" style={{ animationDelay: "0.2s" }}>
                 <Users className="h-5 w-5 text-gray-400" />
                 <div className="text-left"><p className="text-sm font-bold text-white">Team Analysis</p><p className="text-[10px] text-gray-500">Comparing seat needs</p></div>
              </div>
              <div className="absolute -left-32 bottom-0 bg-[#111] border border-white/5 rounded-lg p-3 flex items-center gap-3 animate-bounce shadow-lg" style={{ animationDelay: "0.4s" }}>
                 <Activity className="h-5 w-5 text-gray-400" />
                 <div className="text-left"><p className="text-sm font-bold text-white">Usage Patterns</p><p className="text-[10px] text-gray-500">Analyzing team usage</p></div>
              </div>
              <div className="absolute -right-32 bottom-0 bg-[#111] border border-white/5 rounded-lg p-3 flex items-center gap-3 animate-bounce shadow-lg" style={{ animationDelay: "0.6s" }}>
                 <Zap className="h-5 w-5 text-primary" />
                 <div className="text-left"><p className="text-sm font-bold text-white">Optimization Engine</p><p className="text-[10px] text-gray-500">Finding best alternatives</p></div>
              </div>
            </div>

            <div className="w-full max-w-md">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Analyzing...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
