import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  Calendar, 
  Target, 
  RefreshCw 
} from 'lucide-react';

export default function BriefingModal({ isOpen, onClose, onGenerate, isGenerating }) {
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [customFocus, setCustomFocus] = useState('Central Corridor Rusumo delays & Cold Chain Zone D pharmaceutical integrity');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(targetDate, customFocus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-[#002D56] text-white flex items-center justify-between border-b border-[#001D38]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#004B87] border border-blue-400/30 flex items-center justify-center text-white shrink-0">
              <FileText className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Generate Shift Operations Briefing
              </h3>
              <p className="text-xs text-slate-300">
                Synthesize custom narrative operations brief via AI Microservice
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-white">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#004B87]" />
              <span>Target Briefing Date</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#004B87] font-mono shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#004B87]" />
              <span>Special Operational Focus / Objectives</span>
            </label>
            <textarea
              rows="3"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="e.g. Focus on Red Channel clearance rates and tea export turnaround..."
              className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#004B87] transition leading-relaxed placeholder-slate-400 shadow-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-1.5 rounded-md bg-[#004B87] hover:bg-[#003B6D] text-white text-xs font-bold shadow-xs flex items-center gap-2 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Briefing'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
