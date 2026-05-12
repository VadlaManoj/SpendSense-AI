"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuditResult, AuditContext } from "@/types";
import { saveAuditAction } from "@/app/actions";
import { ArrowRight, Mail } from "lucide-react";

export function LeadCapture({ result, context }: { result: AuditResult, context: AuditContext }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await saveAuditAction(context, result, email);
      if (res.id) {
        router.push(`/result/${res.id}`);
      } else {
        setError(res.error || "Failed to save. Please try again.");
      }
    } catch (err: any) {
      setError(`Unexpected error: ${err?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-primary/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.1)]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">Save Your Action Plan</h3>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Get a shareable link and a personalized AI-generated summary of your infrastructure sent to your inbox.
          {result.totalSavings > 500 && " Plus, get a free consultation with SpendSense."}
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="relative">
            <input 
              type="email" 
              placeholder="founder@startup.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-primary text-white rounded-lg py-3 font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save & Get Link"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
        
        <p className="text-[11px] text-gray-500 mt-4 text-center">
          By saving, you agree to receive a one-time email. No spam, ever.
        </p>
      </div>
    </div>
  );
}
