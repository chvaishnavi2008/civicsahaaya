import { AlertTriangle } from 'lucide-react';

export function Disclaimer({ text }: { text?: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 dark:text-amber-200">
        {text ||
          'CivicSahaaya provides general civic and legal information based on available sources. It does not replace advice from a qualified lawyer or the relevant government authority.'}
      </p>
    </div>
  );
}
