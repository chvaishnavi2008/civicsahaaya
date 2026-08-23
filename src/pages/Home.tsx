import { useNav } from '@/lib/navigation';
import { useAuth } from '@/lib/auth';
import { Compass, FileText, CheckCircle, Upload, Shield, BookOpen, Eye, Lock, ArrowRight, Sparkles } from 'lucide-react';

const demoQueries = [
  'My landlord is refusing to return my security deposit.',
  'I want to know how road repair funds were spent in my village.',
  'I bought a defective product and the seller won\'t help me.',
  'Can I apply for this government welfare scheme?',
  'I received a government notice and don\'t understand what it means.',
];

export function Home() {
  const { navigate, setPrefillQuery } = useNav();
  const { user, demoMode, setDemoMode } = useAuth();

  const startNow = () => {
    if (user || demoMode) {
      navigate('rights-navigator');
    } else {
      navigate('login');
    }
  };

  const tryDemo = () => {
    setDemoMode(true);
    navigate('dashboard');
  };

  const useDemoQuery = (q: string) => {
    setPrefillQuery(q);
    if (!user && !demoMode) setDemoMode(true);
    navigate('rights-navigator');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-accent-300" />
              <span>AI Civic & Legal Empowerment</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-serif">
              Understand Your Rights.<br />Know Your Next Step.
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed">
              Describe your civic or legal problem in plain language. CivicSahaaya helps you understand relevant information, identify possible actions, and prepare the right documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startNow}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-800 font-semibold hover:bg-primary-50 transition-colors"
              >
                Describe Your Problem
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={tryDemo}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/30 font-semibold hover:bg-white/20 transition-colors"
              >
                Try a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo queries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Try a sample problem
          </h3>
          <div className="flex flex-col gap-2">
            {demoQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => useDemoQuery(q)}
                className="text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all text-sm text-gray-700 dark:text-gray-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3 font-serif">
          How It Works
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
          From problem to action plan in four steps.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: 1, title: 'Tell us your problem', desc: 'Describe your issue in your own words, just like talking to a friend.', icon: Compass },
            { num: 2, title: 'AI finds relevant info', desc: 'We search our verified knowledge base for information that matches your situation.', icon: BookOpen },
            { num: 3, title: 'Understand your options', desc: 'See your possible rights and what they mean in simple language.', icon: Shield },
            { num: 4, title: 'Take action', desc: 'Follow a step-by-step plan and generate the documents you need.', icon: ArrowRight },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-xs font-bold text-primary-500 mb-1">STEP {step.num}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-slate-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3 font-serif">
            What CivicSahaaya Can Do
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Four tools to help you navigate civic and legal challenges.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Rights Navigator', desc: 'Describe your problem and get a guided action plan with your rights explained.', icon: Compass, route: 'rights-navigator' as const },
              { title: 'RTI Assistant', desc: 'Convert your question into a structured Right to Information application.', icon: FileText, route: 'rti-assistant' as const },
              { title: 'Scheme Eligibility', desc: 'Find out whether you may qualify for a government welfare scheme.', icon: CheckCircle, route: 'scheme-eligibility' as const },
              { title: 'Document Explainer', desc: 'Upload a government notice or document and get a plain-language explanation.', icon: Upload, route: 'document-explainer' as const },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <button
                  key={feat.title}
                  onClick={() => {
                    if (!user && !demoMode) setDemoMode(true);
                    navigate(feat.route);
                  }}
                  className="card p-6 text-left hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent-100 dark:bg-accent-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feat.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:gap-2 transition-all">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="card p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10 font-serif">
            Built for Trust
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Grounded in verified sources', desc: 'Every recommendation links back to official government sources.', icon: Shield },
              { title: 'Transparent evidence', desc: 'See exactly why each recommendation is made and the source behind it.', icon: BookOpen },
              { title: 'Human-readable explanations', desc: 'No legal jargon — everything is explained in simple, clear language.', icon: Compass },
              { title: 'Privacy-conscious design', desc: 'Your documents are private. You control what is saved and can delete anytime.', icon: Lock },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3 font-serif">Ready to understand your rights?</h2>
          <p className="text-primary-100 mb-6">Start with your problem. We'll guide you through the rest.</p>
          <button
            onClick={startNow}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-800 font-semibold hover:bg-primary-50 transition-colors"
          >
            Start Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
