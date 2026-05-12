import { getAuditAction } from "@/app/actions";
import { runAudit } from "@/lib/audit-engine";
import { ArrowDown, CheckCircle2, Zap, Layers, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function PublicResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getAuditAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4 text-white">
        <h1 className="text-2xl font-bold">Audit Not Found</h1>
        <p className="text-gray-400">This audit link is invalid or has expired.</p>
        <Link href="/audit" className="bg-primary text-white rounded-lg px-6 py-3 font-bold text-sm hover:bg-primary/90 transition-all">
          Run a new Audit
        </Link>
      </div>
    );
  }

  const { context, summary } = res.data;
  const result = runAudit(context);

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary fill-primary" />
            <span className="font-bold text-xl tracking-tight text-white">SpendSense</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium">
            Public Audit Result
          </div>
        </div>

        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            AI Spend Analysis
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            This startup's AI tool stack was analyzed by SpendSense. We found <strong className="text-accent drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">${result.totalSavings}/mo</strong> in hidden savings.
          </p>
        </div>

        {summary && (
          <div className="bg-[#111] border border-primary/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.1)]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
             <div className="relative z-10">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Zap className="h-5 w-5 text-primary" /> AI Analyst Summary
               </h3>
               <p className="text-gray-300 leading-relaxed italic border-l-2 border-primary/50 pl-4 py-2">"{summary}"</p>
             </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" /> Optimization Breakdown
          </h2>
          <div className="space-y-4">
            {result.recommendations.map((rec, i) => (
              <div 
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
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-16 pb-8">
          <h3 className="text-3xl font-extrabold mb-6">Want to analyze your own stack?</h3>
          <Link href="/audit" className="inline-flex items-center gap-2 bg-white text-black rounded-full px-10 py-4 font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Run Free Audit <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
