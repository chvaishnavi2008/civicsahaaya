import { useState, type ChangeEvent } from 'react';
import { Upload, FileText, Loader2, AlertTriangle, Calendar, User, FileCheck, ListChecks, BookOpen } from 'lucide-react';
import { explainDocument, type DocumentExplanation } from '@/lib/documentExplainer';
import { Disclaimer } from '@/components/Disclaimer';

export function DocumentExplainer() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<DocumentExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Please upload a file under 5 MB.');
      return;
    }

    const allowed = ['.txt', '.md', '.csv', '.json', '.html', '.htm'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      setError(`Unsupported file type "${ext}". Please upload a text-based file (TXT, MD, CSV, JSON, HTML). PDF extraction requires a server-side processor which is not available in this demo.`);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setText(content.slice(0, 50000));
    };
    reader.onerror = () => setError('Could not read the file. Please try again.');
    reader.readAsText(file);
  };

  const explain = () => {
    if (!text.trim()) {
      setError('Please upload a document or paste text to explain.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setTimeout(() => {
      const res = explainDocument(text);
      setResult(res);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950 mb-4">
          <Upload className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          Explain a Government Document
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload or paste a government notice, letter, or document and get a plain-language explanation.
        </p>
      </div>

      {/* Upload area */}
      <div className="card p-6 mb-6">
        <label className="label">Upload a document</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 cursor-pointer transition-colors">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {fileName || 'Click to upload (TXT, MD, CSV, JSON, HTML — max 5 MB)'}
            </span>
            <input type="file" accept=".txt,.md,.csv,.json,.html,.htm" onChange={handleFile} className="hidden" />
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          PDF support requires server-side text extraction. For this demo, please paste the document text below or upload a text-based file.
        </p>
      </div>

      {/* Paste text */}
      <div className="card p-6 mb-6">
        <label className="label">Or paste document text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text of your government notice, letter, or document here..."
          rows={6}
          className="input-field resize-none text-sm font-mono"
        />
        <button onClick={explain} disabled={loading || !text.trim()} className="btn-primary w-full mt-4">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing document...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Explain This Document
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Document type */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              What is this document?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.documentType}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{result.whatIsThis}</p>
          </section>

          {/* What it means */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              What does it mean?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.whatItMeans}</p>
          </section>

          {/* Action required */}
          <section className="card p-6 border-l-4 border-l-primary-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              What action is required from you?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.actionRequired}</p>
          </section>

          {/* Important dates */}
          {result.importantDates.length > 0 && (
            <section className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Important Dates
              </h3>
              <div className="space-y-2">
                {result.importantDates.map((d, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      d.urgent
                        ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900'
                        : 'bg-gray-50 dark:bg-slate-800/50'
                    }`}
                  >
                    {d.urgent && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {d.urgent ? '⚠️ Action required by' : d.label}: {d.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Issued by */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Who issued it?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.issuedBy}</p>
          </section>

          {/* Required documents */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Required Documents
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {result.requiredDocuments.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" /> {doc}
                </div>
              ))}
            </div>
          </section>

          {/* If you do nothing */}
          <section className="card p-6 border-l-4 border-l-amber-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              What happens if you do nothing?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{result.ifYouDoNothing}</p>
          </section>

          {/* Important terms */}
          {result.importantTerms.length > 0 && (
            <section className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Important Terms
              </h3>
              <div className="space-y-2">
                {result.importantTerms.map((t, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                    <span className="font-medium text-primary-700 dark:text-primary-300 text-sm">{t.term}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400"> — {t.explanation}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Disclaimer text={result.disclaimer} />
        </div>
      )}
    </div>
  );
}
