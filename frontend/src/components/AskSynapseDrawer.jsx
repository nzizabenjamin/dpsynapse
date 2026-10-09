import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  CheckCircle, 
  Lightbulb, 
  AlertTriangle,
  Layers,
  ShieldCheck,
  Truck,
  Filter,
  ArrowRight
} from 'lucide-react';
import LogisticsTermTooltip from './LogisticsTermTooltip';

export default function AskSynapseDrawer({ 
  isOpen, 
  onClose, 
  onAskAi, 
  isAsking, 
  aiResponse,
  onApplyFilter 
}) {
  const [queryText, setQueryText] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    { text: "What is current truck turnaround at Masaka?", icon: Truck },
    { text: "Explain active bottlenecks and Rusumo border delays", icon: AlertTriangle },
    { text: "Summarize Red Channel customs backlog", icon: ShieldCheck },
    { text: "What is Cold Chain Zone D capacity and temp?", icon: Layers },
  ];

  const suggestionChips = [
    "Show me all containers waiting over 5 days",
    "Which warehouse has the most free space?",
    "Summarize today's customs delays",
    "Show trucks held at Rusumo border",
    "Cold chain pharma temperature compliance"
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!queryText.trim() || isAsking) return;
    onAskAi(queryText.trim());
  };

  const handlePromptClick = (prompt) => {
    setQueryText(prompt);
    onAskAi(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-xl h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#002D56] text-white flex items-center justify-between border-b border-[#001D38]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#004B87] border border-blue-400/30 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Ask Synapse</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/20 uppercase font-mono">
                  Shift AI Assistant
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Natural language operations intelligence for terminal supervisors and clerks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4 bg-[#F8FAFC]">
          
          {/* Quick Prompts Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Recommended Operational Queries
              </span>
              <span className="text-[10px] text-slate-400">Click to ask & filter instantly</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(p.text)}
                    className="p-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-left text-xs text-slate-700 hover:text-slate-900 transition flex items-center gap-2 shadow-2xs group"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                    <span className="truncate flex-1">{p.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Response Area */}
          {isAsking ? (
            <div className="bg-white border border-slate-200 rounded-md p-5 animate-pulse space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-[#004B87] text-xs font-semibold">
                <Sparkles className="w-4 h-4 animate-spin text-[#004B87]" />
                <span>Synapse Operations Engine evaluating terminal telemetry...</span>
              </div>
              <div className="h-3.5 bg-slate-200 rounded w-full"></div>
              <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
              <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
            </div>
          ) : aiResponse ? (
            <div className="bg-white border border-slate-200 rounded-md p-4 space-y-3.5 shadow-sm">
              
              {/* Question & Category Header */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">"{aiResponse.query}"</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#004B87] border border-blue-200 shrink-0 font-mono">
                  {aiResponse.intentCategory}
                </span>
              </div>

              {/* Main Natural Language Answer */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-[#F8FAFC] p-3.5 rounded border border-slate-200">
                {aiResponse.answer}
              </div>

              {/* Optional 1-Click Filter Action Button if AI identified a target subset */}
              {aiResponse.filterTrigger && (
                <div className="bg-blue-50/80 border border-blue-200 rounded-md p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#004B87] font-semibold">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Active: {aiResponse.filterTrigger.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onApplyFilter) {
                        onApplyFilter(aiResponse.filterTrigger);
                      }
                      onClose();
                    }}
                    className="px-3 py-1 rounded bg-[#004B87] hover:bg-[#003B6D] text-white text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
                  >
                    <span>View in Manifest</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Operational Findings */}
              {aiResponse.keyFindings && aiResponse.keyFindings.length > 0 && (
                <div className="pt-1">
                  <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Operational Findings</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {aiResponse.keyFindings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tactical Recommendations */}
              {aiResponse.recommendedActions && aiResponse.recommendedActions.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-[#004B87] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#004B87]" />
                    <span>Tactical Recommendations for Shift Team</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {aiResponse.recommendedActions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0"></span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs bg-white border border-slate-200 rounded-md p-6">
              <Bot className="w-9 h-9 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">How can Synapse assist your shift today?</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Type an operational query below or click any of the suggestion chips.
              </p>
            </div>
          )}

        </div>

        {/* Input Bar & Suggestion Chips directly beneath */}
        <div className="p-3.5 border-t border-slate-200 bg-white space-y-2.5">
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about dwell times, TAT, corridor delays, or warehouse capacity..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-md bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-2xs"
            />
            <button
              type="submit"
              disabled={!queryText.trim() || isAsking}
              className="px-4 py-2 rounded-md bg-[#004B87] hover:bg-[#003B6D] text-white font-semibold text-xs shadow-2xs disabled:opacity-50 transition flex items-center gap-1.5 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Interactive Guided Query Suggestion Chips directly below search bar */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              1-Click Instant Query Chips:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(chip)}
                  className="px-2.5 py-1 rounded-full bg-[#F4F6F8] hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-slate-700 hover:text-[#004B87] transition shadow-2xs text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
