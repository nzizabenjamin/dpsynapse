import React from 'react';
import { 
  Anchor, 
  Sparkles, 
  FileText, 
  MapPin, 
  RefreshCw,
  Activity
} from 'lucide-react';

export default function Navbar({ 
  onOpenAskAi, 
  onOpenBriefingModal, 
  onRefreshAll, 
  isRefreshing, 
  lastUpdated 
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#002D56] text-white border-b border-[#001D38] shadow-sm px-4 lg:px-8 py-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        
        {/* Brand & Terminal Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#004B87] border border-blue-400/30 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>DP WORLD</span>
                <span className="text-[#38BDF8] font-black tracking-wider">SYNAPSE</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-white/10 text-slate-200 border border-white/15 uppercase">
                Operations Hub v1.0
              </span>
            </div>
            <p className="text-xs font-normal text-slate-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Masaka Inland Container Depot & Warehousing Hub &bull; Kigali, Rwanda</span>
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Telemetry Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#001D38]/80 border border-white/10 text-xs text-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-mono text-emerald-300 text-[11px] font-bold">LIVE TELEMETRY</span>
            {lastUpdated && (
              <span className="text-slate-300 font-mono text-[11px] border-l border-white/20 pl-2">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            title="Refresh terminal telemetry"
            className="p-1.5 rounded-md bg-[#003B6D] hover:bg-[#004B87] border border-white/15 text-slate-200 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-300' : ''}`} />
          </button>

          {/* Ask Synapse AI Trigger */}
          <button
            onClick={onOpenAskAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#004B87] hover:bg-[#005B9E] text-white font-semibold text-xs border border-blue-400/40 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Ask Synapse AI</span>
          </button>

          {/* Operational Briefing Button */}
          <button
            onClick={onOpenBriefingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Operations Briefing</span>
          </button>

        </div>
      </div>
    </header>
  );
}

