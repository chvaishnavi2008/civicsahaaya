export interface DocumentExplanation {
  documentType: string;
  whatIsThis: string;
  whatItMeans: string;
  actionRequired: string;
  importantDates: { label: string; date: string; urgent: boolean }[];
  requiredDocuments: string[];
  issuedBy: string;
  ifYouDoNothing: string;
  importantTerms: { term: string; explanation: string }[];
  disclaimer: string;
  confidence: number;
}

export function explainDocument(text: string): DocumentExplanation {
  const lower = text.toLowerCase();
  const dates = extractDates(text);
  const docType = detectDocType(lower);

  const result: DocumentExplanation = {
    documentType: docType.documentType,
    whatIsThis: docType.whatIsThis,
    whatItMeans: docType.whatItMeans,
    actionRequired: docType.actionRequired,
    importantDates: dates,
    requiredDocuments: docType.requiredDocuments,
    issuedBy: docType.issuedBy,
    ifYouDoNothing: docType.ifYouDoNothing,
    importantTerms: extractTerms(text),
    disclaimer:
      'This explanation is generated from the text content of your document. It is general information and does not replace advice from a qualified lawyer or the relevant authority. Please verify any deadlines or actions from the original document.',
    confidence: docType.confidence,
  };

  return result;
}

interface DocTypeResult {
  documentType: string;
  whatIsThis: string;
  whatItMeans: string;
  actionRequired: string;
  requiredDocuments: string[];
  issuedBy: string;
  ifYouDoNothing: string;
  confidence: number;
}

function detectDocType(text: string): DocTypeResult {
  if (text.includes('notice') || text.includes('summons') || text.includes('court')) {
    return {
      documentType: 'Legal Notice / Court Document',
      whatIsThis: 'This appears to be a legal notice or court-related document. It likely contains an official communication regarding a legal matter.',
      whatItMeans: 'This document is informing you of a legal action, requirement, or proceeding. The content may include a demand, a hearing date, or a response requirement.',
      actionRequired: 'You may need to respond by a specific date, appear in court, or take legal action. Do not ignore this document.',
      requiredDocuments: ['The original notice', 'Any related case numbers', 'Your identity proof', 'Relevant correspondence'],
      issuedBy: 'A court, lawyer, or legal authority (check the letterhead and signature)',
      ifYouDoNothing: 'Ignoring a legal notice may result in an ex-parte order (decision made without you), penalties, or loss of your right to respond.',
      confidence: 0.7,
    };
  }

  if (text.includes('tax') || text.includes('gst') || text.includes('income tax') || text.includes('assessment')) {
    return {
      documentType: 'Tax Notice / GST Notice',
      whatIsThis: 'This appears to be a tax-related notice from the Income Tax Department or GST authority.',
      whatItMeans: 'This document is informing you about a tax assessment, demand, or compliance requirement. It may require you to file a return, pay tax, or respond to a query.',
      actionRequired: 'Check the deadline for response. You may need to file a return, pay the demanded amount, or submit a clarification.',
      requiredDocuments: ['PAN card', 'Previous tax returns', 'Bank statements', 'Relevant invoices'],
      issuedBy: 'Income Tax Department or GST Authority (check the notice reference number)',
      ifYouDoNothing: 'Ignoring a tax notice can lead to penalties, interest, and prosecution. Respond within the deadline.',
      confidence: 0.75,
    };
  }

  if (text.includes('ration') || text.includes('aadhaar') || text.includes('voter') || text.includes('passport') || text.includes('application')) {
    return {
      documentType: 'Government Application / Certificate',
      whatIsThis: 'This appears to be a government application form, certificate, or service-related document.',
      whatItMeans: 'This document is related to a government service — it could be an application acknowledgment, a certificate, or a service-related communication.',
      actionRequired: 'Check if any action is needed from you — such as submitting documents, attending an appointment, or paying a fee.',
      requiredDocuments: ['Identity proof (Aadhaar/PAN)', 'Address proof', 'Photographs', 'Supporting documents as mentioned in the form'],
      issuedBy: 'A government department or office (check the letterhead)',
      ifYouDoNothing: 'If this is an application, not responding may delay or cancel your service. If it is a certificate, verify the details are correct.',
      confidence: 0.65,
    };
  }

  if (text.includes('bank') || text.includes('loan') || text.includes('account') || text.includes('emi') || text.includes('credit')) {
    return {
      documentType: 'Banking / Financial Document',
      whatIsThis: 'This appears to be a banking or financial document — possibly a loan statement, account notice, or financial communication.',
      whatItMeans: 'This document relates to your banking or financial relationship. It may contain account details, loan terms, or a notice about your account.',
      actionRequired: 'Check for any payment deadlines, account freeze notices, or required responses. Verify all charges and amounts.',
      requiredDocuments: ['Bank statements', 'Loan agreement (if applicable)', 'Identity proof', 'Account details'],
      issuedBy: 'A bank or financial institution (check the letterhead)',
      ifYouDoNothing: 'Ignoring a banking notice may lead to penalties, account freeze, or loan default consequences.',
      confidence: 0.6,
    };
  }

  return {
    documentType: 'General Government / Official Document',
    whatIsThis: 'This appears to be an official document. Based on the content, we can provide a general explanation.',
    whatItMeans: 'This document contains official communication. The exact nature depends on the issuing authority and the content — please read it carefully.',
    actionRequired: 'Look for any deadlines, response dates, or action items mentioned in the document. If you are unsure, contact the issuing authority.',
    requiredDocuments: ['The original document', 'Your identity proof', 'Any referenced documents or numbers'],
    issuedBy: 'Check the letterhead, signature, and reference number on the original document',
    ifYouDoNothing: 'If this document requires a response or action, ignoring it may lead to missed deadlines, penalties, or loss of rights. When in doubt, seek help.',
    confidence: 0.5,
  };
}

function extractDates(text: string): { label: string; date: string; urgent: boolean }[] {
  const dates: { label: string; date: string; urgent: boolean }[] = [];

  const datePatterns = [
    /\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/gi,
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/g,
    /\b((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi,
  ];

  const found = new Set<string>();
  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (!found.has(match[1])) {
        found.add(match[1]);
        const isUrgent = /by|before|deadline|last date|due date|within/i.test(text.slice(Math.max(0, match.index! - 40), match.index! + match[0].length + 40));
        dates.push({ label: isUrgent ? 'Action required by' : 'Date mentioned', date: match[1], urgent: isUrgent });
      }
    }
  }

  return dates.slice(0, 5);
}

function extractTerms(text: string): { term: string; explanation: string }[] {
  const terms: { term: string; explanation: string }[] = [];
  const termMap: Record<string, string> = {
    'RTI': 'Right to Information — your right to request information from a government department.',
    'PIO': 'Public Information Officer — the officer designated to receive and respond to RTI applications.',
    'GST': 'Goods and Services Tax — a unified indirect tax on the supply of goods and services.',
    'PAN': 'Permanent Account Number — a 10-character alphanumeric identifier issued by the Income Tax Department.',
    'Aadhaar': 'A 12-digit unique identification number issued by UIDAI to Indian residents.',
    'BPL': 'Below Poverty Line — an economic category used to determine eligibility for welfare schemes.',
    'EMI': 'Equated Monthly Installment — a fixed payment amount made by a borrower to a lender each month.',
    'FOIR': 'Fixed Obligations to Income Ratio — a measure used by banks to assess loan repayment capacity.',
    'KYC': 'Know Your Customer — a process used by financial institutions to verify the identity of clients.',
    'NOC': 'No Objection Certificate — a legal document stating that no objection is raised by the issuer.',
    'TDS': 'Tax Deducted at Source — a mechanism where tax is deducted from income at the point of payment.',
    'CPGRAMS': 'Centralized Public Grievance Redress and Monitoring System — the central government grievance portal.',
  };

  const upper = text.toUpperCase();
  for (const [term, explanation] of Object.entries(termMap)) {
    if (upper.includes(term)) {
      terms.push({ term, explanation });
    }
  }

  return terms.slice(0, 6);
}
