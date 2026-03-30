import React from 'react';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import useClientAI from '../../hooks/useClientAI';
import { formatDistanceToNow } from 'date-fns';

/**
 * Shows past/present/future AI briefing on the client detail page.
 */
export default function AIBriefing({ clientId, clientName }) {
  const { 
    briefing, 
    briefingLoading, 
    briefingError, 
    generateBriefing 
  } = useClientAI(clientId);

  if (briefingLoading && !briefing) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-5 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-slate-50 rounded w-full"></div>
          <div className="h-20 bg-slate-50 rounded w-5/6"></div>
          <div className="h-20 bg-slate-50 rounded w-4/6"></div>
        </div>
        <p className="text-[13px] text-slate-400 mt-4 text-center">AI is analyzing client data...</p>
      </div>
    );
  }

  if (briefingError) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 mb-5 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="text-slate-900 font-semibold mb-1">Could not generate briefing</h3>
        <p className="text-slate-500 text-sm mb-4">{briefingError}</p>
        <button 
          onClick={() => generateBriefing()}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!briefing) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-7 mb-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-[18px] h-[18px] text-blue-500" />
          <h2 className="text-base font-semibold text-slate-900">AI Client Intelligence</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {briefing.generated_at && (
            <span className="text-[11px] text-slate-400">
              Generated {formatDistanceToNow(new Date(briefing.generated_at))} ago
            </span>
          )}
          <button 
            onClick={() => generateBriefing()}
            disabled={briefingLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${briefingLoading ? 'animate-spin' : ''}`} />
            {briefingLoading ? 'Analyzing...' : 'Regenerate'}
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-5"></div>

      <div className="space-y-5">
        {/* PAST */}
        <div className="pl-4 border-l-3 border-blue-500">
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold uppercase rounded-sm mb-2">
            PAST ANALYSIS
          </span>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Relationship History</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {briefing.past}
          </p>
        </div>

        {/* PRESENT */}
        <div className="pl-4 border-l-3 border-amber-500">
          <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-bold uppercase rounded-sm mb-2">
            PRESENT STATUS
          </span>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Where Things Stand Today</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {briefing.present}
          </p>
        </div>

        {/* FUTURE */}
        <div className="pl-4 border-l-3 border-purple-500">
          <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-[11px] font-bold uppercase rounded-sm mb-2">
            AI PREDICTION
          </span>
          <h3 className="text-sm font-bold text-slate-900 mb-1">What Happens Next</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {briefing.future}
          </p>
        </div>
      </div>
    </div>
  );
}
