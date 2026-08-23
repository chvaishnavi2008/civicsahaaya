import { useState, useEffect } from 'react';
import { FolderOpen, FileText, Download, Trash2, Edit, Eye, Loader2, X, Save, Check } from 'lucide-react';
import { getDocuments, deleteDocument, updateDocument, downloadAsText, downloadAsPDF } from '@/lib/documentStore';
import { useAuth } from '@/lib/auth';
import { useNav } from '@/lib/navigation';
import type { SavedDocument } from '@/lib/types';

export function MyDocuments() {
  const { user, demoMode } = useAuth();
  const { navigate } = useNav();
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<SavedDocument | null>(null);
  const [editDoc, setEditDoc] = useState<SavedDocument | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSaved, setEditSaved] = useState(false);

  const loadDocs = async () => {
    setLoading(true);
    const { data, error } = await getDocuments();
    if (error) {
      setError(error);
    } else {
      setDocs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadDocs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const { error } = await deleteDocument(id);
    if (error) {
      setError(error);
    } else {
      setDocs(docs.filter((d) => d.id !== id));
    }
  };

  const handleSaveEdit = async () => {
    if (!editDoc) return;
    const { error } = await updateDocument(editDoc.id, editContent);
    if (error) {
      setError(error);
    } else {
      setEditSaved(true);
      setDocs(docs.map((d) => (d.id === editDoc.id ? { ...d, content: editContent } : d)));
      setTimeout(() => {
        setEditSaved(false);
        setEditDoc(null);
      }, 1000);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="card p-8 text-center">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {demoMode ? 'Sign up to save documents' : 'Sign in to view your documents'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {demoMode
              ? 'You are in demo mode. Documents generated in demo mode are not saved. Create an account to keep your documents.'
              : 'Your generated documents are saved to your account and persist across sessions.'}
          </p>
          <button onClick={() => navigate('login')} className="btn-primary">
            {demoMode ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          My Documents
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your generated documents are saved here and remain available across sessions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
        </div>
      ) : docs.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No documents yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Generate a document from the Rights Navigator or RTI Assistant to see it here.
          </p>
          <button onClick={() => navigate('rights-navigator')} className="btn-primary">
            Go to Rights Navigator
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{doc.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{doc.document_type}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setViewDoc(doc)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditDoc(doc);
                      setEditContent(doc.content);
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadAsText(doc.title.replace(/\s/g, '_'), doc.content)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadAsPDF(doc.title.replace(/\s/g, '_'), doc.title, doc.content)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewDoc(null)}>
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{viewDoc.title}</h2>
              <button onClick={() => setViewDoc(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans leading-relaxed">{viewDoc.content}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setEditDoc(null)}>
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Edit: {editDoc.title}</h2>
              <div className="flex items-center gap-2">
                {editSaved && <span className="text-sm text-accent-600 flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span>}
                <button onClick={handleSaveEdit} className="btn-primary text-sm">
                  <Save className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setEditDoc(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                className="input-field font-mono text-sm resize-none"
                rows={20}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
