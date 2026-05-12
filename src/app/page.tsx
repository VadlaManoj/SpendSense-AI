"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Clock, DollarSign, Users, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
      {/* Dark tech grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />
      
      {/* Bottom glowing aura */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/20 blur-[150px] pointer-events-none rounded-t-[100%]" />

      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex items-center justify-between z-50 fixed top-0 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary fill-primary" />
          <span className="font-bold text-xl tracking-tight">SpendSense</span>
        </div>
        
        <Link 
          href="/audit" 
          className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 px-5 py-2.5 rounded-md font-medium text-sm transition-all ml-auto"
        >
          Run Free Audit
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl w-full flex flex-col items-center"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#111] border border-white/10 text-xs font-semibold mb-10 text-gray-300">
            <span className="flex items-center gap-1.5 text-accent"><Zap className="h-3 w-3 fill-accent" /> AI-Powered</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-accent">100% Free</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-accent">Takes 60 seconds</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-6xl md:text-[5.5rem] font-extrabold tracking-tight leading-[1.1] mb-6">
            Stop Burning Money <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              on AI Tools
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Audit your entire AI stack in 60 seconds and discover hidden savings. The average startup <strong className="text-white">saves $8,000/year.</strong>
          </p>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative group"
          >
            <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <Link 
              href="/audit"
              className="relative flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary/90 transition-all"
            >
              Start Your Free Audit
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
          <p className="mt-4 text-xs text-gray-500">No email required to see results</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center flex-wrap gap-x-16 gap-y-8 mt-24 max-w-5xl w-full border-t border-white/10 pt-10"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Clock className="h-5 w-5 text-primary" /> 60 sec</div>
            <span className="text-sm text-gray-500">Audit time</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white"><ShieldCheck className="h-5 w-5 text-white" /> 100%</div>
            <span className="text-sm text-gray-500">Free</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white"><DollarSign className="h-5 w-5 text-primary" /> $8K+</div>
            <span className="text-sm text-gray-500">Avg. savings</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white"><Users className="h-5 w-5 text-white" /> 500+</div>
            <span className="text-sm text-gray-500">Startups audited</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
