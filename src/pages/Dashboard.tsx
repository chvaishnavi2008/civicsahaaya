import { useNav } from '@/lib/navigation';
import { useAuth } from '@/lib/auth';
import { Compass, FileText, CheckCircle, Upload, ArrowRight, FolderOpen, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDocuments } from '@/lib/documentStore';
import type { SavedDocument } from '@/lib/types';

export function Dashboard() {
  const { navigate } = useNav();
  const { user, demoMode } = useAuth();
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    if (user) {
      getDocuments().then(({ data }) => {
        if (data) {
          setDocs(data.slice(0, 3));
          setDocCount(data.length);
        }
      });
    }
  }, [user]);

  const cards = [
    {
      title: 'Ask About Your Rights',
      desc: 'Describe your problem and get a guided action plan.',
      icon: Compass,
      route: 'rights-navigator' as const,
      color: 'primary',
    },
    {
      title: 'Draft an RTI',
      desc: 'Convert your question into a structured RTI application.',
      icon: FileText,
      route: 'rti-assistant' as const,
      color: 'primary',
    },
    {
      title: 'Check Scheme Eligibility',
      desc: 'Find out whether you may qualify for a government scheme.',
      icon: CheckCircle,
      route: 'scheme-eligibility' as const,
      color: 'accent',
    },
    {
      title: 'Explain a Document',
      desc: 'Upload a government notice or document.',
      icon: Upload,
      route: 'document-explainer' as const,
      color: 'accent',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          {user ? `Welcome, ${user.user_metadata?.name || user.email}` : 'Welcome to CivicSahaaya'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {demoMode && !user
            ? 'You are in demo mode. Your documents will not be saved. Sign up to keep your work.'
            : 'How can we help you today?'}
        </p>
      </div>

      {/* Stats */}
      {(user || demoMode) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{docCount}</p>
                <p className="text-sm text-gray-500">Documents saved</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-950 flex items-center justify-center">
                <Compass className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">10</p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
            </div>
          </div>
          <div className="card p-5 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Demo mode active</p>
                <p className="text-sm text-gray-500">No login needed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => navigate(card.route)}
              className="card p-6 text-left hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  card.color === 'primary'
                    ? 'bg-primary-100 dark:bg-primary-950'
                    : 'bg-accent-100 dark:bg-accent-950'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    card.color === 'primary'
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-accent-600 dark:text-accent-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:gap-2 transition-all">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent documents */}
      {user && docs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Documents</h2>
            <button onClick={() => navigate('my-documents')} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => navigate('my-documents')}
                className="card p-4 w-full flex items-center justify-between hover:shadow-sm transition-shadow text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{doc.title}</p>
                    <p className="text-sm text-gray-500">{doc.document_type}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
