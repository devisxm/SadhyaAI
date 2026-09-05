"use client";

import { motion } from "framer-motion";

interface ProbabilityGaugeProps {
  probability: number | null;
  threatLevel: string | null;
}

export function ProbabilityGauge({ probability, threatLevel }: ProbabilityGaugeProps) {
  const isDanger = probability !== null && probability > 85;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-8">
      
      {/* Outer Glow & Rings */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* Soft Ambient Background Glow */}
        <div 
          className={`absolute inset-0 rounded-full blur-[40px] opacity-20 transition-colors duration-1000 ${
            probability === null ? "bg-zinc-500" : isDanger ? "bg-red-500" : "bg-blue-500"
          }`}
        />

        {/* Outer Glass Ring */}
        <div className="absolute inset-0 rounded-full border border-white/[0.08] bg-white/[0.02]" />

        {/* Dynamic Fluid Fill */}
        <div className="absolute inset-4 rounded-full bg-zinc-950 border border-white/5 overflow-hidden flex items-end justify-center shadow-inner">
          <motion.div
            className={`w-full rounded-t-full opacity-90 transition-colors duration-1000 ${
              probability === null ? "bg-zinc-800" : isDanger ? "bg-gradient-to-t from-red-600 to-red-400" : "bg-gradient-to-t from-blue-600 to-blue-400"
            }`}
            initial={{ height: "0%" }}
            animate={{ height: probability === null ? "10%" : `${probability}%` }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
          />
        </div>

        {/* Text Readout Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-lg">
          {probability !== null ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center"
            >
              <span className="text-6xl font-semibold tracking-tighter text-white">
                {probability}%
              </span>
            </motion.div>
          ) : (
            <span className="text-zinc-500 text-lg font-medium tracking-tight">--%</span>
          )}
        </div>
      </div>

      {/* Threat Level Badge */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Moru Breach Probability
        </span>
        <div 
          className={`px-6 py-2 rounded-full border backdrop-blur-md transition-colors duration-1000 ${
            probability === null
              ? "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"
              : isDanger
              ? "bg-red-500/20 border-red-500/30 text-red-400"
              : "bg-blue-500/20 border-blue-500/30 text-blue-400"
          }`}
        >
          <span className="text-sm font-semibold tracking-wide">
            {probability === null ? "SYSTEM IDLE" : threatLevel}
          </span>
        </div>
      </div>

    </div>
  );
}
