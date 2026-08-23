import { useState, type FormEvent } from 'react';
import { FileText, Loader2, ArrowRight, AlertTriangle, Lightbulb, Info } from 'lucide-react';
import { analyzeProblem } from '@/lib/ragEngine';
import type { AnalysisResult } from '@/lib/types';
import { Disclaimer } from '@/components/Disclaimer';
import { DocumentGeneratorModal } from '@/components/DocumentGeneratorModal';

const exampleRTI = [
  'I want to know how much money was allocated for road repairs in my village during the last 3 years.',
  'I want to know the status of my ration card application submitted 3 months ago.',
  'I want to know how many teachers are working in the government school in my area.',
];

export function RTIAssistant() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDocGen, setShowDocGen] = useState(false);

  const generate = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const res = analyzeProblem(query);
      res.document_type = 'RTI Application';
      setResult(res);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950 mb-4">
          <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          RTI Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Convert your question into a structured Right to Information application.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-900 mb-6">
        <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
        <p className="text-sm text-primary-800 dark:text-primary-200">
          The Right to Information (RTI) Act, 2005 allows any Indian citizen to request information from government departments. The PIO must respond within 30 days.
        </p>
      </div>

      <form onSubmit={generate} className="mb-6">
        <label className="label text-base">What information do you want to request?</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I want to know how much money was allocated for road repairs in my village during the last 3 years."
          rows={3}
          className="input-field text-base resize-none"
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button type="submit" disabled={loading || !query.trim()} className="btn-primary flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Structuring your RTI...
              </>
            ) : (
              <>
                Generate RTI Application <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-500 mb-2">Try an example:</p>
          <div className="flex flex-col gap-1.5">
            {exampleRTI.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  setResult(null);
                }}
                className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </form>

      {loading && (
        <div className="card p-8 text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Structuring your RTI application...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Understanding */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              What We Understood
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.summary}</p>
            {result.sources.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Relevant authority:</strong> {result.sources[0].authority}
                </p>
              </div>
            )}
          </section>

          {/* RTI questions */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Suggested RTI Questions
            </h3>
            <ol className="space-y-2">
              <li className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-primary-600">1.</span>
                Please provide the total funds allocated for {result.issue.toLowerCase().includes('road') ? 'road repair and maintenance' : 'the above-mentioned purpose'} during the last 3 financial years.
              </li>
              <li className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-primary-600">2.</span>
                Please provide details of work orders, contractors, and amounts paid for the above-mentioned works during this period.
              </li>
              <li className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-primary-600">3.</span>
                Please provide copies of inspection reports and quality certificates for the completed works.
              </li>
              <li className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-primary-600">4.</span>
                If the information is not available with your office, please inform the correct public authority under Section 6(3) of the RTI Act.
              </li>
            </ol>
          </section>

          {/* Warning */}
          <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              We couldn't verify the exact department address and PIO name. Please confirm the authority details from the official government portal before submitting your RTI application.
            </p>
          </div>

          {/* Generate button */}
          <section className="card p-6 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/30 dark:to-slate-900 border-primary-200 dark:border-primary-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Ready to Generate Your RTI</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Fill in your personal details and we'll generate a complete RTI application.
                </p>
                <button onClick={() => setShowDocGen(true)} className="btn-primary">
                  <FileText className="w-4 h-4" />
                  Generate RTI Application
                </button>
              </div>
            </div>
          </section>

          {/* Sources */}
          {result.sources.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sources & Evidence</h3>
              <div className="space-y-3">
                {result.sources.map((src, i) => (
                  <div key={i} className="card p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{src.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{src.authority}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        {src.url}
                      </a>
                      <span className="text-xs text-gray-400">Verified: {src.verified_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Disclaimer />

          <DocumentGeneratorModal
            open={showDocGen}
            onClose={() => setShowDocGen(false)}
            docType="RTI Application"
            analysis={result}
          />
        </div>
      )}
    </div>
  );
}
