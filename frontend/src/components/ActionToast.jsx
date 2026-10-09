import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ActionToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type !== 'error' && toast.type !== 'warning';
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed top-16 right-4 lg:right-8 z-50 max-w-md w-full bg-white border border-slate-200 rounded-lg shadow-xl p-3.5 flex items-start gap-3 animate-in slide-in-from-top duration-200">
      <div className={`p-1.5 rounded-md shrink-0 ${
        isSuccess ? 'bg-emerald-50 text-emerald-700' : isWarning ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
      }`}>
        {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : isWarning ? <Info className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1 pr-1">
        <h4 className="text-xs font-bold text-slate-900 leading-snug">
          {toast.title || 'Action Triggered'}
        </h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-normal">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 p-1 rounded transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
