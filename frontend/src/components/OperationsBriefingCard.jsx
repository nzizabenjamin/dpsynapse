import React from 'react';
import { 
  FileText, 
  AlertOctagon, 
  Lightbulb, 
  CheckCircle, 
  RefreshCw 
} from 'lucide-react';

export default function OperationsBriefingCard({ 
  briefing, 
  loading, 
  onRegenerate, 
  isRegenerating 
}) {
  if (loading || !briefing) {
    return (
      <div className="bg-white border border-slate-200 p-6 rounded-md animate-pulse shadow-sm">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-4/5"></div>
      </div>
    );
  }

  // Filter out any leftover MD greetings if present in older database seed data
  let cleanSummary = briefing.executiveSummary || '';
  cleanSummary = cleanSummary.replace(/Good morning,\s*Managing Director\.?\s*/gi, '');
  cleanSummary = cleanSummary.replace(/Managing Director/gi, 'Operations Team');

  let cleanTitle = briefing.title || 'Masaka Inland Port — Daily Operations & Fleet Status Briefing';
  cleanTitle = cleanTitle.replace(/Managing Director Intelligence Briefing/gi, 'Masaka Inland Port — Daily Operations & Fleet Status Briefing');
  cleanTitle = cleanTitle.replace(/MD Intelligence Briefing/gi, 'Daily Operations & Fleet Status Briefing');
  cleanTitle = cleanTitle.replace(/Executive Intelligence Briefing/gi, 'Daily Operations & Fleet Status Briefing');

  const highlights = Array.isArray(briefing.operationalHighlights) ? briefing.operationalHighlights : [];
  const risks = Array.isArray(briefing.criticalRisks) ? briefing.criticalRisks : [];
  const recommendations = Array.isArray(briefing.strategicRecommendations) ? briefing.strategicRecommendations : [];

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 lg:p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-50 text-[#004B87] border border-blue-200 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {cleanTitle}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#004B87] border border-blue-200 uppercase tracking-wider">
                07:00 Shift Briefing
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generated {briefing.generatedAt ? new Date(briefing.generatedAt).toLocaleString() : 'Today'} &bull; Prepared by Synapse Operations Intelligence Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-[#004B87]' : ''}`} />
            <span>{isRegenerating ? 'Synthesizing...' : 'Re-synthesize Brief'}</span>
          </button>
        </div>
      </div>

      {/* Operational Summary Paragraph */}
      <div className="py-4">
        <div className="bg-[#F8FAFC] p-4 rounded-md border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed">
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-1 text-slate-500">
            Shift Operations Summary
          </div>
          {cleanSummary}
        </div>
      </div>

      {/* 3-Column Intelligence Grid: Highlights, Risks, Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        
        {/* Operational Highlights */}
        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-md flex flex-col">
          <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Operational Highlights</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 flex-1">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Operational Risks */}
        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-md flex flex-col">
          <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Critical Bottlenecks & Risks</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 flex-1">
            {risks.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tactical Recommendations */}
        <div className="bg-[#F8FAFC] border border-slate-200 p-4 rounded-md flex flex-col">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Lightbulb className="w-4 h-4 text-[#004B87] shrink-0" />
            <span>Tactical Recommendations</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 flex-1">
            {recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0"></span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
