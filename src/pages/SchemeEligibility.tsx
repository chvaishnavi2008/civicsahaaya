import { useState } from 'react';
import { CheckCircle, Search, ArrowRight, Loader2, ChevronRight, X, FileText, AlertTriangle, Info } from 'lucide-react';
import { searchSchemes } from '@/lib/schemeEngine';
import { checkEligibility } from '@/lib/schemeEngine';
import { schemes } from '@/lib/schemes';
import type { Scheme, SchemeEligibilityResult } from '@/lib/types';
import { Disclaimer } from '@/components/Disclaimer';
import { analyzeProblem } from '@/lib/ragEngine';
import { DocumentGeneratorModal } from '@/components/DocumentGeneratorModal';

export function SchemeEligibility() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SchemeEligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDocGen, setShowDocGen] = useState(false);

  const filtered = searchQuery.trim() ? searchSchemes(searchQuery) : schemes;

  const selectScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setAnswers({});
    setResult(null);
    setShowSearch(false);
    setSearchQuery('');
  };

  const check = () => {
    if (!selectedScheme) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const res = checkEligibility(selectedScheme, answers);
      setResult(res);
      setLoading(false);
    }, 1500);
  };

  const startOver = () => {
    setSelectedScheme(null);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-100 dark:bg-accent-950 mb-4">
          <CheckCircle className="w-7 h-7 text-accent-600 dark:text-accent-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          Check Scheme Eligibility
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Find out whether you may qualify for a government welfare scheme.
        </p>
      </div>

      {/* Search button */}
      {!selectedScheme && (
        <div className="card p-6 mb-6">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-primary-700 dark:text-primary-300">Search for a scheme</span>
            </div>
            <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Search from {schemes.length}+ government welfare schemes
          </p>
        </div>
      )}

      {/* Search modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/50" onClick={() => setShowSearch(false)}>
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-800">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Search Government Schemes</h2>
              <button onClick={() => setShowSearch(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, category, or keyword..."
                  className="input-field pl-11"
                />
              </div>
              <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No schemes found. Try a different search term.</p>
                ) : (
                  filtered.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => selectScheme(scheme)}
                      className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{scheme.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{scheme.ministry}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                              {scheme.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{scheme.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected scheme - questions */}
      {selectedScheme && !result && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedScheme.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedScheme.ministry}</p>
                <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 mt-2">
                  {selectedScheme.category}
                </span>
              </div>
              <button onClick={startOver} className="btn-ghost text-sm">
                <X className="w-4 h-4" /> Change scheme
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{selectedScheme.description}</p>
            <div className="mt-4 p-3 rounded-lg bg-accent-50 dark:bg-accent-950/30">
              <p className="text-sm text-accent-700 dark:text-accent-300">
                <strong>Benefits:</strong> {selectedScheme.benefits}
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Answer a few questions to check your eligibility
            </h3>
            <div className="space-y-4">
              {selectedScheme.eligibility.map((condition) => (
                <div key={condition.field}>
                  <label className="label">{condition.label}</label>
                  {condition.type === 'select' ? (
                    <select
                      className="input-field"
                      value={answers[condition.field] || ''}
                      onChange={(e) => setAnswers({ ...answers, [condition.field]: e.target.value })}
                    >
                      <option value="">Select...</option>
                      {condition.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : condition.type === 'number' ? (
                    <input
                      type="number"
                      className="input-field"
                      value={answers[condition.field] || ''}
                      onChange={(e) => setAnswers({ ...answers, [condition.field]: e.target.value })}
                      placeholder="Enter number"
                    />
                  ) : (
                    <input
                      type="text"
                      className="input-field"
                      value={answers[condition.field] || ''}
                      onChange={(e) => setAnswers({ ...answers, [condition.field]: e.target.value })}
                      placeholder="Enter text"
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={check} disabled={loading} className="btn-primary w-full mt-6">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking eligibility...
                </>
              ) : (
                <>
                  Check Eligibility <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Status */}
          <div className="card p-6">
            {result.status === 'eligible' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-950 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-600 dark:text-accent-400" />
                </div>
                <h2 className="text-xl font-bold text-accent-700 dark:text-accent-300 mb-2">Likely Eligible</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                  Based on the information you provided, you appear to meet the listed eligibility conditions.
                </p>
              </div>
            )}
            {result.status === 'more_info' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300 mb-2">More Information Needed</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                  We need a few more details to determine your eligibility. Please answer the remaining questions.
                </p>
              </div>
            )}
            {result.status === 'not_eligible' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Likely Not Eligible</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                  Based on your answers, you may not meet some of the eligibility conditions for this scheme.
                </p>
              </div>
            )}
          </div>

          {/* Matched conditions */}
          {result.matched.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-500" /> Conditions Matched
              </h3>
              <ul className="space-y-1.5">
                {result.matched.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-accent-500 shrink-0" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Not matched */}
          {result.not_matched.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" /> Conditions Not Matched
              </h3>
              <ul className="space-y-1.5">
                {result.not_matched.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <X className="w-4 h-4 text-red-500 shrink-0" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing info */}
          {result.missing_info.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Missing Information
              </h3>
              <ul className="space-y-1.5">
                {result.missing_info.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required documents */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Required Documents</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.required_documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" /> {doc}
                </div>
              ))}
            </div>
          </div>

          {/* Application steps */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Application Steps</h3>
            <div className="space-y-0">
              {result.application_steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 pb-3">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Official source */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" /> Official Source
            </h3>
            <a
              href={result.scheme.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {result.scheme.source_url}
            </a>
            <p className="text-xs text-gray-400 mt-1">Last verified: {result.scheme.last_verified}</p>
          </div>

          {/* Generate application */}
          {result.status !== 'not_eligible' && (
            <button
              onClick={() => setShowDocGen(true)}
              className="btn-primary w-full"
            >
              <FileText className="w-4 h-4" /> Generate Scheme Application
            </button>
          )}

          <button onClick={startOver} className="btn-secondary w-full">
            Check Another Scheme
          </button>

          <Disclaimer text={result.disclaimer} />

          {result && (
            <DocumentGeneratorModal
              open={showDocGen}
              onClose={() => setShowDocGen(false)}
              docType="Scheme Application Assistance"
              analysis={analyzeProblem(result.scheme.name)}
              prefillData={{ description: `I would like to apply for ${result.scheme.name}. ${result.scheme.description}` }}
            />
          )}
        </div>
      )}
    </div>
  );
}
