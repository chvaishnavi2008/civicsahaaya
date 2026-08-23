import { useNav } from '@/lib/navigation';
import { HelpCircle, Compass, FileText, CheckCircle, Upload, FolderOpen, MessageCircle, Lock, Shield, BookOpen } from 'lucide-react';
import { Disclaimer } from '@/components/Disclaimer';

export function Help() {
  const { navigate } = useNav();

  const faqs = [
    {
      q: 'Is CivicSahaaya a lawyer?',
      a: 'No. CivicSahaaya provides general civic and legal information based on available sources. It does not replace advice from a qualified lawyer or the relevant government authority. Always consult a professional for your specific situation.',
    },
    {
      q: 'Where does the information come from?',
      a: 'All information comes from our curated knowledge base, which includes references to official government sources, acts, and portals. Each recommendation links back to its source so you can verify it independently.',
    },
    {
      q: 'Can CivicSahaaya guarantee legal outcomes?',
      a: 'No. CivicSahaaya cannot guarantee any legal outcome. It helps you understand your situation and possible options, but final decisions are made by courts, authorities, and government departments.',
    },
    {
      q: 'What is demo mode?',
      a: 'Demo mode lets you explore all features without creating an account. However, documents generated in demo mode are not saved. Sign up to keep your documents across sessions.',
    },
    {
      q: 'How do I save a document?',
      a: 'When you generate a document (RTI, complaint, letter, etc.), click the "Save" button. The document will be stored in your account and available in the My Documents page.',
    },
    {
      q: 'Is my data private?',
      a: 'Your documents are private to your account. You can delete any document at any time. Do not upload unnecessary sensitive information. API keys are never exposed to the client.',
    },
    {
      q: 'What if the system cannot answer my question?',
      a: 'If CivicSahaaya does not have enough verified information, it will clearly tell you instead of making up an answer. You can try rephrasing your question or consult a professional.',
    },
  ];

  const features = [
    { icon: Compass, title: 'Rights Navigator', desc: 'Describe a problem and get a guided action plan.', route: 'rights-navigator' as const },
    { icon: FileText, title: 'RTI Assistant', desc: 'Convert your question into a structured RTI application.', route: 'rti-assistant' as const },
    { icon: CheckCircle, title: 'Scheme Eligibility', desc: 'Check if you may qualify for a government scheme.', route: 'scheme-eligibility' as const },
    { icon: Upload, title: 'Document Explainer', desc: 'Upload a document and get a plain-language explanation.', route: 'document-explainer' as const },
    { icon: FolderOpen, title: 'My Documents', desc: 'View, edit, download, and delete your saved documents.', route: 'my-documents' as const },
    { icon: MessageCircle, title: 'Chat Assistant', desc: 'Ask follow-up questions anytime with the floating chat button.', route: 'home' as const },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950 mb-4">
          <HelpCircle className="w-7 h-7 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">
          Help & FAQ
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Everything you need to know about using CivicSahaaya.
        </p>
      </div>

      {/* Features */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Features</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.title}
                onClick={() => navigate(f.route)}
                className="card p-4 text-left flex items-start gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{f.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Your Data & Privacy
        </h2>
        <div className="card p-6 space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">Your documents are private to your account.</p>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">Do not upload unnecessary sensitive information.</p>
          </div>
          <div className="flex items-start gap-3">
            <FolderOpen className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">You can delete any generated document at any time.</p>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">Documents are not stored permanently unless you explicitly choose to save them.</p>
          </div>
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
