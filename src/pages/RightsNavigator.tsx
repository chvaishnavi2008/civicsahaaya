import { useState, useEffect, type FormEvent } from 'react';
import { useNav } from '@/lib/navigation';
import { analyzeProblem } from '@/lib/ragEngine';
import type { AnalysisResult } from '@/lib/types';
import { Disclaimer } from '@/components/Disclaimer';
import { WhyRecommendation } from '@/components/WhyRecommendation';
import { Loader2, Compass, FileText, ClipboardList, ListChecks, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentGeneratorModal } from '@/components/DocumentGeneratorModal';

const exampleProblems = [
  'My landlord has not returned my security deposit after I moved out.',
  'I bought a defective product and the seller won\'t help me.',
  'I want to know how road repair funds were spent in my village.',
  'My employer has not paid my salary for two months.',
  'My bank charged me a fee I was never told about.',
];

const loadingMessages = [
  'Understanding your problem...',
  'Searching relevant civic information...',
  'Checking available sources...',
  'Preparing your action plan...',
];

export function RightsNavigator() {
  const { prefillQuery } = useNav();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [showDocGen, setShowDocGen] = useState(false);

  useEffect(() => {
    if (prefillQuery) {
      setQuery(prefillQuery);
    }
  }, [prefillQuery]);

  const analyze = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setLoadingMsg(0);
    const interval = setInterval(() => {
      setLoadingMsg((m) => (m + 1) % loadingMessages.length);
    }, 700);
    setTimeout(() => {
      const res = analyzeProblem(query);
      setResult(res);
      setLoading(false);
      clearInterval(interval);
    }, 2200);
  };

  const useExample = () => {
    const random = exampleProblems[Math.floor(Math.random() * exampleProblems.length)];
    setQuery(random);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Input */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950 mb-4">
          <Compass className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          Rights Navigator
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Describe your problem in plain language and get a guided action plan.
        </p>
      </div>

      <form onSubmit={analyze} className="mb-6">
        <label className="label text-base">What problem are you facing?</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="My landlord has not returned my security deposit even though I moved out two months ago."
          rows={4}
          className="input-field text-base resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button type="submit" disabled={loading || !query.trim()} className="btn-primary flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingMessages[loadingMsg]}
              </>
            ) : (
              <>
                Analyze My Problem <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <button type="button" onClick={useExample} className="btn-secondary">
            Use Example Problem
          </button>
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="card p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{loadingMessages[loadingMsg]}</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Detected issue */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  Detected Issue
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {result.category} — {result.issue}
                </h2>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${result.confidence * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1 block">Confidence</span>
              </div>
            </div>
            <div className="badge bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
              <Compass className="w-3.5 h-3.5" />
              {result.category}
            </div>
          </div>

          {/* Problem Summary */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Problem Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.summary}</p>
          </section>

          {/* What This Means */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <BookIcon />
              What This Means
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.what_this_means}</p>
          </section>

          {/* Possible Rights */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Possible Rights / Options
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.possible_rights.map((right, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{right.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{right.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Plan */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Step-by-Step Action Plan
            </h3>
            <div className="space-y-0">
              {result.action_steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                      {step.step}
                    </div>
                    {i < result.action_steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 dark:bg-slate-700 my-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{step.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">{step.description}</p>
                    {step.documents.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {step.documents.slice(0, 3).map((doc, j) => (
                          <span key={j} className="badge bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                            <ClipboardList className="w-3 h-3" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    )}
                    {step.document_type && (
                      <button
                        onClick={() => setShowDocGen(true)}
                        className="btn-ghost text-sm text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                      >
                        <FileText className="w-4 h-4" />
                        Generate Document
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Required Documents */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Required Documents / Evidence
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.required_documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0" />
                  {doc}
                </div>
              ))}
            </div>
          </section>

          {/* Generate Document CTA */}
          <section className="card p-6 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/30 dark:to-slate-900 border-primary-200 dark:border-primary-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Recommended: Generate a Document</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{result.recommended_action}</p>
                <button onClick={() => setShowDocGen(true)} className="btn-primary">
                  <FileText className="w-4 h-4" />
                  Generate {result.document_type}
                </button>
              </div>
            </div>
          </section>

          {/* Why this recommendation */}
          {result.sources.length > 0 && (
            <WhyRecommendation
              sources={result.sources}
              confidence={result.confidence}
              reason={`This recommendation is based on the information retrieved from ${result.sources[0].title}. The relevant conditions from ${result.sources[0].authority} have been applied to your situation. You can verify this independently using the source link below.`}
            />
          )}

          {/* Sources */}
          {result.sources.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Sources & Evidence
              </h3>
              <div className="space-y-3">
                {result.sources.map((src, i) => (
                  <div key={i} className="card p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{src.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{src.authority}</p>
                    {src.section && <p className="text-xs text-gray-400 mt-0.5">Category: {src.section}</p>}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {src.url}
                      </a>
                      <span className="text-xs text-gray-400">Verified: {src.verified_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <Disclaimer text={result.disclaimer} />
        </div>
      )}

      {/* No result fallback */}
      {!result && !loading && !query.trim() && (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <Compass className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Describe your problem above and click "Analyze My Problem" to get started.</p>
        </div>
      )}

      {result && (
        <DocumentGeneratorModal
          open={showDocGen}
          onClose={() => setShowDocGen(false)}
          docType={result.document_type}
          analysis={result}
        />
      )}
    </div>
  );
}

function BookIcon() {
  return (
    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
