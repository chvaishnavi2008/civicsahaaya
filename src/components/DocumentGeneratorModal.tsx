import { useState, useEffect, type FormEvent } from 'react';
import { X, FileText, Copy, Download, Edit, Save, Check, Loader2 } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import { generateDocument, type DocumentFormData } from '@/lib/documentGenerator';
import { saveDocument, downloadAsText, downloadAsPDF } from '@/lib/documentStore';
import { useAuth } from '@/lib/auth';

interface Props {
  open: boolean;
  onClose: () => void;
  docType: string;
  analysis: AnalysisResult;
  prefillData?: Partial<DocumentFormData>;
}

export function DocumentGeneratorModal({ open, onClose, docType, analysis, prefillData }: Props) {
  const { user, demoMode } = useAuth();
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form');
  const [formData, setFormData] = useState<DocumentFormData>({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    dateOfIncident: '',
    organization: '',
    description: analysis.summary || '',
    amount: '',
    previousCommunication: '',
    desiredResolution: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({ ...prev, ...prefillData }));
    }
  }, [prefillData]);

  if (!open) return null;

  const generate = (e: FormEvent) => {
    e.preventDefault();
    setStep('generating');
    setTimeout(() => {
      const content = generateDocument(docType, analysis, formData);
      setGeneratedContent(content);
      setEditContent(content);
      setStep('result');
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaveError(null);
    if (!user) {
      setSaveError('Please sign in to save documents. In demo mode, you can copy or download instead.');
      return;
    }
    const { error } = await saveDocument({
      document_type: docType,
      title: `${docType} — ${analysis.issue}`,
      content: generatedContent,
      issue: analysis.issue,
    });
    if (error) {
      setSaveError(error);
    } else {
      setSaved(true);
    }
  };

  const handleClose = () => {
    setStep('form');
    setGeneratedContent('');
    setSaved(false);
    setSaveError(null);
    setEditing(false);
    onClose();
  };

  const fieldClass = 'input-field text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{docType}</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={generate} className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      className={fieldClass}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input
                      className={fieldClass}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Address</label>
                    <input
                      className={fieldClass}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Your address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className={fieldClass}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Problem Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Date of Incident</label>
                    <input
                      type="date"
                      className={fieldClass}
                      value={formData.dateOfIncident}
                      onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Organization / Person Involved</label>
                    <input
                      className={fieldClass}
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Name of the authority or person"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Description of Issue</label>
                    <textarea
                      className={`${fieldClass} resize-none`}
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your issue in detail"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Amount Involved (if applicable)</label>
                    <input
                      className={fieldClass}
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g. 50,000"
                    />
                  </div>
                  <div>
                    <label className="label">Previous Communication</label>
                    <input
                      className={fieldClass}
                      value={formData.previousCommunication}
                      onChange={(e) => setFormData({ ...formData, previousCommunication: e.target.value })}
                      placeholder="Any previous complaint numbers or dates"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Desired Resolution</label>
                    <input
                      className={fieldClass}
                      value={formData.desiredResolution}
                      onChange={(e) => setFormData({ ...formData, desiredResolution: e.target.value })}
                      placeholder="What outcome do you want?"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                <FileText className="w-4 h-4" />
                Generate {docType}
              </button>
            </form>
          )}

          {step === 'generating' && (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Generating your document...</p>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-4">
              {saved && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-50 dark:bg-accent-950/30 border border-accent-200 dark:border-accent-900 text-accent-700 dark:text-accent-300 text-sm">
                  <Check className="w-4 h-4" />
                  Document saved to My Documents.
                </div>
              )}
              {saveError && (
                <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-sm text-amber-700 dark:text-amber-300">
                  {saveError}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button onClick={handleCopy} className="btn-secondary text-sm">
                  {copied ? <Check className="w-4 h-4 text-accent-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => downloadAsText(`${docType.replace(/\s/g, '_')}`, generatedContent)} className="btn-secondary text-sm">
                  <Download className="w-4 h-4" /> Download TXT
                </button>
                <button onClick={() => downloadAsPDF(`${docType.replace(/\s/g, '_')}`, docType, generatedContent)} className="btn-secondary text-sm">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={() => setEditing(!editing)} className="btn-secondary text-sm">
                  <Edit className="w-4 h-4" /> {editing ? 'Preview' : 'Edit'}
                </button>
                {user && !saved && (
                  <button onClick={handleSave} className="btn-primary text-sm">
                    <Save className="w-4 h-4" /> Save
                  </button>
                )}
              </div>

              {editing ? (
                <textarea
                  className="input-field font-mono text-sm resize-none"
                  rows={20}
                  value={editContent}
                  onChange={(e) => {
                    setEditContent(e.target.value);
                    setGeneratedContent(e.target.value);
                  }}
                />
              ) : (
                <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              )}

              <p className="text-xs text-gray-400">
                {demoMode && !user ? 'Demo mode: documents are not saved. Sign up to save your documents.' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
