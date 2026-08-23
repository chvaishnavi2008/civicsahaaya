import type { AnalysisResult, Category, KnowledgeDocument, SourceRef } from './types';
import { knowledgeBase } from './knowledgeBase';

const DISCLAIMER =
  'CivicSahaaya provides general civic and legal information based on available sources. It does not replace advice from a qualified lawyer or the relevant government authority.';

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  'Consumer Rights': ['product', 'defective', 'seller', 'shop', 'purchase', 'refund', 'warranty', 'consumer', 'goods', 'service deficiency', 'bought', 'defective product'],
  'Tenant/Housing': ['landlord', 'tenant', 'rent', 'deposit', 'lease', 'rental', 'eviction', 'flat', 'house rent', 'security deposit', 'vacate'],
  'Government Services': ['passport', 'ration card', 'pension', 'certificate', 'delay', 'pending', 'application status', 'government office', 'service'],
  RTI: ['rti', 'right to information', 'information request', 'public authority', 'pio', 'transparency', 'government data', 'records'],
  Workplace: ['salary', 'wages', 'employer', 'fired', 'workplace', 'job', 'labour', 'overtime', 'termination', 'unpaid wages', 'boss', 'office'],
  Education: ['school', 'college', 'admission', 'fee', 'student', 'university', 'teacher', 'exam', 'result', 'scholarship'],
  'Welfare Schemes': ['scheme', 'welfare', 'subsidy', 'benefit', 'bpl', 'government scheme', 'eligibility', 'apply for scheme'],
  'Banking/Financial Services': ['bank', 'account', 'atm', 'transaction', 'loan', 'charge', 'banking', 'credit card', 'emi', 'freeze'],
  'Public Grievance': ['grievance', 'complaint against government', 'public service', 'cpgrams', 'no response', 'official'],
  Other: [],
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function scoreCategory(query: string): { category: Category; score: number } {
  const q = normalize(query);
  let best: Category = 'Other';
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (q.includes(kw)) score += kw.length > 6 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat as Category;
    }
  }
  return { category: best, score: bestScore };
}

function retrieveRelevant(query: string): KnowledgeDocument[] {
  const q = normalize(query);
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = knowledgeBase.map((doc) => {
    let score = 0;
    for (const kw of doc.keywords) {
      if (q.includes(kw)) score += 3;
    }
    for (const w of words) {
      for (const kw of doc.keywords) {
        if (kw.includes(w) && w.length > 3) score += 1;
      }
      if (doc.summary.toLowerCase().includes(w)) score += 0.5;
    }
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, 3);
  return top.map((s) => s.doc);
}

function buildSources(docs: KnowledgeDocument[]): SourceRef[] {
  return docs.map((d) => ({
    title: d.title,
    authority: d.authority,
    section: d.category,
    url: d.source_url,
    verified_date: d.last_verified,
  }));
}

function deriveIssue(query: string, docs: KnowledgeDocument[]): string {
  const q = normalize(query);
  if (q.includes('security deposit') || q.includes('deposit') && q.includes('landlord')) return 'Security Deposit Dispute';
  if (q.includes('defective') || (q.includes('product') && q.includes('seller'))) return 'Defective Product Complaint';
  if (q.includes('road') || q.includes('fund') || q.includes('repair')) return 'Public Infrastructure Spending Inquiry';
  if (q.includes('scheme') || q.includes('welfare') || q.includes('eligibility')) return 'Welfare Scheme Eligibility Inquiry';
  if (q.includes('wage') || q.includes('salary') || q.includes('unpaid')) return 'Unpaid Wages Dispute';
  if (q.includes('bank') || q.includes('charge') || q.includes('account')) return 'Banking Service Grievance';
  if (q.includes('grievance') || q.includes('complaint')) return 'Public Grievance Filing';
  if (q.includes('school') || q.includes('college') || q.includes('admission')) return 'Education Grievance';
  if (docs.length > 0) return `${docs[0].category} — General Inquiry`;
  return 'General Civic Issue';
}

function buildActionSteps(docs: KnowledgeDocument[]): AnalysisResult['action_steps'] {
  const doc = docs[0];
  if (!doc || !doc.procedure) {
    return [
      {
        step: 1,
        title: 'Gather information',
        description: 'Collect all relevant documents and communication related to your issue.',
        documents: ['Identity proof', 'Relevant correspondence'],
      },
      {
        step: 2,
        title: 'File a written complaint',
        description: 'Submit a written complaint to the concerned authority or person.',
        documents: ['Written complaint', 'Supporting documents'],
      },
    ];
  }

  return doc.procedure.map((proc, i) => ({
    step: i + 1,
    title: proc.split('.')[0] || proc.slice(0, 60),
    description: proc,
    documents: doc.required_documents || [],
    document_type: i === 1 ? 'Formal Request Letter' : i === doc.procedure!.length - 1 ? 'Public Grievance' : undefined,
  }));
}

function buildPossibleRights(docs: KnowledgeDocument[]): { title: string; description: string }[] {
  if (docs.length === 0) {
    return [
      { title: 'Request information', description: 'You have the right to ask the concerned authority for information about your situation.' },
      { title: 'File a written complaint', description: 'You can submit a written complaint to the relevant department or authority.' },
    ];
  }
  const doc = docs[0];
  const rights: { title: string; description: string }[] = [];
  if (doc.procedure) {
    rights.push({ title: 'Send a formal request', description: 'You can send a written request to the concerned party asking for resolution.' });
  }
  if (doc.important_notes) {
    rights.push({ title: 'Escalate to higher authority', description: 'If the first step fails, you can escalate to a higher authority or regulatory body.' });
  }
  rights.push({ title: 'Preserve evidence', description: 'Keep all documents, receipts, and communication as evidence for your case.' });
  rights.push({ title: 'Seek remedy', description: 'You may be entitled to a refund, replacement, compensation, or other remedy depending on your situation.' });
  return rights;
}

function recommendDocType(category: Category, query: string): string {
  const q = normalize(query);
  if (q.includes('rti') || q.includes('information') || q.includes('right to information') || category === 'RTI') return 'RTI Application';
  if (category === 'Consumer Rights') return 'Consumer Complaint';
  if (category === 'Public Grievance') return 'Public Grievance';
  if (category === 'Tenant/Housing') return 'Formal Request Letter';
  if (category === 'Workplace') return 'Formal Request Letter';
  if (category === 'Banking/Financial Services') return 'Complaint to Appropriate Authority';
  if (category === 'Welfare Schemes') return 'Scheme Application Assistance';
  if (category === 'Education') return 'Formal Request Letter';
  return 'Formal Request Letter';
}

export function analyzeProblem(query: string): AnalysisResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      category: 'Other',
      issue: 'No problem described',
      summary: 'Please describe your problem so we can help.',
      what_this_means: 'We need more information to assist you.',
      possible_rights: [],
      action_steps: [],
      required_documents: [],
      recommended_action: 'Please enter a description of your problem.',
      document_type: 'Formal Request Letter',
      sources: [],
      confidence: 0,
      disclaimer: DISCLAIMER,
      knowledge_doc_ids: [],
    };
  }

  const { category, score } = scoreCategory(trimmed);
  const docs = retrieveRelevant(trimmed);
  const confidence = Math.min(0.95, 0.4 + score * 0.12 + (docs.length > 0 ? 0.15 : 0));

  const issue = deriveIssue(trimmed, docs);
  const primaryDoc = docs[0];

  return {
    category,
    issue,
    summary: primaryDoc
      ? `You appear to be dealing with ${primaryDoc.summary.toLowerCase().split('.')[0]}.`
      : 'We have received your problem description. Based on the information available, we will try to guide you.',
    what_this_means: primaryDoc
      ? primaryDoc.summary
      : 'Your problem has been noted. While we do not have specific verified information for this exact situation, we can still help you with general guidance on how to proceed.',
    possible_rights: buildPossibleRights(docs),
    action_steps: buildActionSteps(docs),
    required_documents: primaryDoc?.required_documents || ['Identity proof', 'Relevant correspondence'],
    recommended_action: primaryDoc
      ? `We recommend you start by sending a formal written request, then escalate if needed. The recommended document type is: ${recommendDocType(category, trimmed)}.`
      : 'We recommend filing a written complaint with the concerned authority.',
    document_type: recommendDocType(category, trimmed),
    sources: buildSources(docs),
    confidence,
    disclaimer: DISCLAIMER,
    knowledge_doc_ids: docs.map((d) => d.id),
  };
}

export function getKnowledgeDoc(id: string): KnowledgeDocument | undefined {
  return knowledgeBase.find((d) => d.id === id);
}

export function searchKnowledgeBase(query: string): KnowledgeDocument[] {
  return retrieveRelevant(query);
}

export { DISCLAIMER };
