import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

const LOGISTICS_GLOSSARY = {
  TEU: {
    term: "Twenty-Foot Equivalent Unit (TEU)",
    category: "Container Capacity",
    explanation: "Standard industry measure for shipping containers. A standard 20-foot box is 1 TEU; a large 40-foot box is 2 TEUs."
  },
  TAT: {
    term: "Truck Turnaround Time (TAT)",
    category: "Terminal Velocity",
    explanation: "The total duration from when a haulier truck arrives at Masaka gate until it finishes unloading and departs. Target: Under 45 minutes."
  },
  AEO: {
    term: "Authorized Economic Operator (AEO)",
    category: "Customs Compliance",
    explanation: "A trusted trader certification granted by Rwanda Revenue Authority (RRA) that grants automatic fast-track green-channel clearance."
  },
  OSBP: {
    term: "One-Stop Border Post (OSBP)",
    category: "Border Trade",
    explanation: "A synchronized border crossing (e.g. Rusumo with Tanzania or Kagitumba with Uganda) where exit and entry customs are completed together."
  },
  SCT: {
    term: "Single Customs Territory (SCT)",
    category: "Customs Regime",
    explanation: "East African Community trade agreement allowing duties to be cleared once at maritime ports (Dar es Salaam / Mombasa) for seamless transit to Kigali."
  },
  CFS: {
    term: "Container Freight Station (CFS)",
    category: "Warehouse Logistics",
    explanation: "A dedicated terminal staging facility where shipping containers are packed, unpacked (destuffed), and cargo is sorted for distribution."
  },
  FCL: {
    term: "Full Container Load (FCL)",
    category: "Cargo Type",
    explanation: "A complete container designated exclusively for a single importer or factory, delivered directly as one unit."
  },
  LCL: {
    term: "Less than Container Load (LCL)",
    category: "Cargo Type",
    explanation: "A container sharing consolidated cargo from multiple different businesses, requiring manual sorting at the dry port."
  },
  REEFER: {
    term: "Refrigerated Container (Reefer)",
    category: "Cold Chain",
    explanation: "An insulated shipping container equipped with active cooling that plugs into electrical gantries to protect pharma vaccines, dairy, and fresh produce."
  },
  BONDED: {
    term: "Customs Bonded Warehouse",
    category: "Customs Holding",
    explanation: "A secured customs-controlled facility where imported goods are stored safely before import taxes or duties are settled."
  },
  "RED CHANNEL": {
    term: "Red Channel (Physical & Scan)",
    category: "RRA Customs Verification",
    explanation: "RRA customs routing requiring full container X-ray scanning and manual physical inspection before release."
  },
  "GREEN CHANNEL": {
    term: "Green Channel (Immediate Fast-Track)",
    category: "RRA Customs Verification",
    explanation: "Automatic instant customs clearance upon arrival with zero physical inspection delays."
  },
  "YELLOW CHANNEL": {
    term: "Yellow Channel (Documentary Audit)",
    category: "RRA Customs Verification",
    explanation: "Customs check requiring digital verification of commercial invoices, certificates of origin, and packing lists."
  },
  "BLUE CHANNEL": {
    term: "Blue Channel (Post-Audit)",
    category: "RRA Customs Verification",
    explanation: "Immediate cargo release for pre-vetted AEO trusted traders; compliance audits occur later at company premises."
  }
};

export default function LogisticsTermTooltip({ termKey, children, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const normalizedKey = (termKey || "").toUpperCase().trim();
  const info = LOGISTICS_GLOSSARY[normalizedKey] || {
    term: termKey,
    category: "Logistics Term",
    explanation: "Operational terminology used in terminal operating and freight tracking systems."
  };

  return (
    <span className={`relative inline-flex items-center gap-1 group ${className}`}>
      {children || <span>{termKey}</span>}
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center justify-center text-slate-400 hover:text-[#004B87] cursor-pointer focus:outline-none p-0.5 rounded transition"
        title="Click or hover for plain English explanation"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {/* Floating Tooltip Popover */}
      {isOpen && (
        <span 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-md shadow-xl border border-slate-700 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left font-normal normal-case"
        >
          <span className="flex items-center justify-between text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1 border-b border-slate-700 pb-1">
            <span>{info.category}</span>
            <span className="text-slate-400 font-mono">{normalizedKey}</span>
          </span>
          <span className="font-bold text-white text-xs block mb-1">
            {info.term}
          </span>
          <span className="text-slate-300 text-[11px] leading-relaxed block">
            {info.explanation}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></span>
        </span>
      )}
    </span>
  );
}
