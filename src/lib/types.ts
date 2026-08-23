export type Category =
  | 'Consumer Rights'
  | 'Tenant/Housing'
  | 'Government Services'
  | 'RTI'
  | 'Workplace'
  | 'Education'
  | 'Welfare Schemes'
  | 'Banking/Financial Services'
  | 'Public Grievance'
  | 'Other';

export interface KnowledgeDocument {
  id: string;
  title: string;
  authority: string;
  category: Category;
  jurisdiction: string;
  summary: string;
  eligibility?: string[];
  procedure?: string[];
  required_documents?: string[];
  important_notes?: string[];
  official_source: string;
  source_url: string;
  last_verified: string;
  keywords: string[];
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  documents: string[];
  document_type?: string;
}

export interface SourceRef {
  title: string;
  authority: string;
  section?: string;
  url: string;
  verified_date: string;
}

export interface AnalysisResult {
  category: Category;
  issue: string;
  summary: string;
  what_this_means: string;
  possible_rights: { title: string; description: string }[];
  action_steps: ActionStep[];
  required_documents: string[];
  recommended_action: string;
  document_type: string;
  sources: SourceRef[];
  confidence: number;
  disclaimer: string;
  knowledge_doc_ids: string[];
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  eligibility: { label: string; field: string; options?: string[]; type: 'select' | 'number' | 'text' }[];
  benefits: string;
  required_documents: string[];
  application_steps: string[];
  official_source: string;
  source_url: string;
  last_verified: string;
  keywords: string[];
}

export interface SchemeEligibilityResult {
  scheme: Scheme;
  status: 'eligible' | 'more_info' | 'not_eligible';
  matched: string[];
  not_matched: string[];
  missing_info: string[];
  required_documents: string[];
  application_steps: string[];
  official_source: string;
  disclaimer: string;
}

export interface SavedDocument {
  id: string;
  document_type: string;
  title: string;
  content: string;
  issue: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
