import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, TrendingUp } from 'lucide-react';
import type { SourceRef } from '@/lib/types';

interface WhyProps {
  sources: SourceRef[];
  confidence: number;
  reason: string;
}

export function WhyRecommendation({ sources, confidence, reason }: WhyProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
          <HelpCircle className="w-4 h-4" />
          Why this recommendation?
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && (
        <div className="px-4 py-4 space-y-4 bg-white dark:bg-slate-900">
          {/* Reason */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              How this applies to you
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{reason}</p>
          </div>

          {/* Confidence */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              Confidence Level
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Sources */}
          {sources.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                Source Used
              </h4>
              <div className="space-y-2">
                {sources.map((src, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{src.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{src.authority}</p>
                    {src.section && <p className="text-xs text-gray-500 dark:text-gray-400">Section: {src.section}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {src.url}
                      </a>
                      <span className="text-xs text-gray-400">Verified: {src.verified_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            You can independently verify any recommendation by checking the source above.
          </p>
        </div>
      )}
    </div>
  );
}
