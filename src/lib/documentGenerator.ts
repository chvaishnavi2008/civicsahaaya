import type { AnalysisResult } from './types';

export interface DocumentFormData {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  dateOfIncident: string;
  organization: string;
  description: string;
  amount: string;
  previousCommunication: string;
  desiredResolution: string;
}

export function generateDocument(
  docType: string,
  analysis: AnalysisResult,
  formData: DocumentFormData,
): string {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  switch (docType) {
    case 'RTI Application':
      return generateRTI(analysis, formData, today);
    case 'Consumer Complaint':
      return generateConsumerComplaint(analysis, formData, today);
    case 'Public Grievance':
      return generatePublicGrievance(analysis, formData, today);
    case 'Scheme Application Assistance':
      return generateSchemeApplication(analysis, formData, today);
    case 'Complaint to Appropriate Authority':
      return generateAuthorityComplaint(analysis, formData, today);
    case 'Formal Request Letter':
    default:
      return generateFormalRequest(analysis, formData, today);
  }
}

function generateRTI(analysis: AnalysisResult, data: DocumentFormData, today: string): string {
  return `To,
The Public Information Officer
${data.organization || '[Department / Public Authority — please verify from the official portal]'}

Subject: Application under the Right to Information Act, 2005

Date: ${today}

Respected Sir/Madam,

I, ${data.fullName || '[Your Name]'}, residing at ${data.address || '[Your Address]'}, hereby request the following information under the Right to Information Act, 2005.

Information Requested:

1. ${data.description || '[Describe the specific information you are requesting]'}
2. Please provide the details of funds allocated and spent for the above-mentioned purpose during the relevant period.
3. Please provide copies of relevant records, approvals, and work orders related to the above.
4. If the information is not available with your office, please inform me of the correct public authority to whom this application should be transferred under Section 6(3) of the RTI Act.

${data.previousCommunication ? `Previous communication reference: ${data.previousCommunication}` : ''}

I am enclosing the application fee of ₹10 (or as applicable) as per the RTI rules.

Applicant Details:
Name: ${data.fullName || '[Your Name]'}
Address: ${data.address || '[Your Address]'}
Phone: ${data.phone || '[Your Phone]'}
Email: ${data.email || '[Your Email]'}

Kindly provide the information within 30 days as per Section 7(1) of the RTI Act, 2005.

Yours faithfully,

${data.fullName || '[Your Name]'}

---

Note: Please verify the correct Public Information Officer and department address from the official government portal before submitting. The application fee and submission method may vary by state.`;
}

function generateConsumerComplaint(analysis: AnalysisResult, data: DocumentFormData, today: string): string {
  return `To,
The President,
District Consumer Disputes Redressal Forum
${data.organization ? `[District where ${data.organization} is located]` : '[District]'}

Subject: Consumer Complaint under Section 35 of the Consumer Protection Act, 2019

Date: ${today}

Respected Sir/Madam,

I, ${data.fullName || '[Your Name]'}, residing at ${data.address || '[Your Address]'}, hereby file this complaint under the Consumer Protection Act, 2019.

1. Particulars of the Complainant:
   Name: ${data.fullName || '[Your Name]'}
   Address: ${data.address || '[Your Address]'}
   Phone: ${data.phone || '[Your Phone]'}
   Email: ${data.email || '[Your Email]'}

2. Particulars of the Opposite Party:
   ${data.organization || '[Name and address of the seller/service provider]'}

3. Facts of the Complaint:
   ${data.description || '[Describe the issue in detail — what you purchased, when, what went wrong, and how the seller responded]'}
   ${data.dateOfIncident ? `Date of incident: ${data.dateOfIncident}` : ''}
   ${data.amount ? `Amount involved: ₹${data.amount}` : ''}

4. Previous Communication:
   ${data.previousCommunication || '[Describe any previous communication with the seller, including complaint numbers and dates]'}

5. Relief Sought:
   ${data.desiredResolution || 'I request the Forum to direct the opposite party to provide a replacement/refund/compensation as appropriate.'}

6. Jurisdiction:
   The total claim amount is within the jurisdiction of the District Forum.

I request the Hon'ble Forum to admit this complaint and provide relief.

Yours faithfully,

${data.fullName || '[Your Name]'}

---

Note: You can also file this complaint online through the e-Daakhil portal. Please attach all supporting documents (bill, warranty, photos, correspondence) when filing.`;
}

function generatePublicGrievance(analysis: AnalysisResult, data: DocumentFormData, today: string): string {
  return `To,
The Senior Officer / Head of Department
${data.organization || '[Department Name — please verify from the official portal]'}

Subject: Public Grievance — ${analysis.issue || 'Request for Redressal'}

Date: ${today}

Respected Sir/Madam,

I, ${data.fullName || '[Your Name]'}, residing at ${data.address || '[Your Address]'}, am filing this grievance regarding the following matter.

Description of Grievance:
${data.description || '[Describe your grievance in detail]'}

${data.dateOfIncident ? `Date of incident/issue: ${data.dateOfIncident}` : ''}
${data.amount ? `Amount involved: ₹${data.amount}` : ''}

Previous Communication:
${data.previousCommunication || 'I have not received a satisfactory response despite previous attempts to resolve this issue.'}

Relief Requested:
${data.desiredResolution || 'I request you to look into this matter and provide a resolution at the earliest.'}

Applicant Details:
Name: ${data.fullName || '[Your Name]'}
Address: ${data.address || '[Your Address]'}
Phone: ${data.phone || '[Your Phone]'}
Email: ${data.email || '[Your Email]'}

I request you to acknowledge this grievance and provide a response within 30 days.

Yours faithfully,

${data.fullName || '[Your Name]'}

---

Note: You can also file this grievance online through the CPGRAMS portal (pgportal.gov.in) for central government departments, or through your state's grievance portal.`;
}

function generateSchemeApplication(analysis: AnalysisResult, data: DocumentFormData, today: string): string {
  return `To,
The Concerned Officer
${data.organization || '[Department / Office handling the scheme — please verify from the official scheme portal]'}

Subject: Application for ${analysis.issue || 'Government Welfare Scheme'}

Date: ${today}

Respected Sir/Madam,

I, ${data.fullName || '[Your Name]'}, residing at ${data.address || '[Your Address]'}, hereby apply for the above-mentioned scheme.

Applicant Details:
Name: ${data.fullName || '[Your Name]'}
Address: ${data.address || '[Your Address]'}
Phone: ${data.phone || '[Your Phone]'}
Email: ${data.email || '[Your Email]'}

Purpose of Application:
${data.description || '[Describe why you are applying and which scheme you are interested in]'}

${data.amount ? `Amount/Benefit sought: ${data.amount}` : ''}

Previous Communication:
${data.previousCommunication || 'This is my first application for this scheme.'}

Declaration:
I declare that the information provided above is true to the best of my knowledge. I understand that eligibility is determined by the concerned government authority and that providing false information may lead to rejection or legal action.

I request you to process my application and inform me of the status.

Yours faithfully,

${data.fullName || '[Your Name]'}

---

Note: Please verify the exact application process, required documents, and submission method from the official scheme portal. This is an application assistance draft and not a substitute for the official application form.`;
}

function generateAuthorityComplaint(analysis: AnalysisResult, data: DocumentFormData, today: string): string {
  return `To,
The Grievance Redressal Officer
${data.organization || '[Name of the Bank / Institution / Authority]'}

Subject: Complaint regarding ${analysis.issue || 'service deficiency'}

Date: ${today}

Respected Sir/Madam,

I, ${data.fullName || '[Your Name]'}, am a customer/user of ${data.organization || 'your institution'} and am filing this complaint regarding the following matter.

Details of Complaint:
${data.description || '[Describe the issue in detail]'}

${data.dateOfIncident ? `Date of incident: ${data.dateOfIncident}` : ''}
${data.amount ? `Amount involved: ₹${data.amount}` : ''}

Previous Communication:
${data.previousCommunication || 'I have not received a satisfactory response to my previous complaint(s).'}

Relief Requested:
${data.desiredResolution || 'I request you to investigate this matter and provide appropriate redressal.'}

Applicant Details:
Name: ${data.fullName || '[Your Name]'}
Address: ${data.address || '[Your Address]'}
Phone: ${data.phone || '[Your Phone]'}
Email: ${data.email || '[Your Email]'}

I request you to acknowledge this complaint and provide a resolution within 30 days. If unresolved, I reserve the right to escalate to the Banking Ombudsman / appropriate regulatory authority.

Yours faithfully,

${data.fullName || '[Your Name]'}

---

Note: If this complaint is about a bank, you can escalate to the RBI Ombudsman after 30 days if unresolved. File online at the RBI Integrated Ombudsman portal.`;
}

function generateFormalRequest(analysis: AnalysisResult, data: DocumentFormData, today: string): string {
  return `To,
${data.organization || '[Name and address of the concerned person/authority]'}

Subject: Formal Request — ${analysis.issue || 'Request for Resolution'}

Date: ${today}

Respected Sir/Madam,

I, ${data.fullName || '[Your Name]'}, residing at ${data.address || '[Your Address]'}, am writing to formally request the following.

Description of the Issue:
${data.description || '[Describe your issue in detail]'}

${data.dateOfIncident ? `Date of incident: ${data.dateOfIncident}` : ''}
${data.amount ? `Amount involved: ₹${data.amount}` : ''}

Previous Communication:
${data.previousCommunication || 'I have attempted to resolve this matter informally but have not received a satisfactory response.'}

Request:
${data.desiredResolution || 'I kindly request you to look into this matter and provide a resolution at the earliest.'}

My Contact Details:
Name: ${data.fullName || '[Your Name]'}
Address: ${data.address || '[Your Address]'}
Phone: ${data.phone || '[Your Phone]'}
Email: ${data.email || '[Your Email]'}

I look forward to your response within a reasonable period. If I do not hear from you, I may need to escalate this matter to the appropriate authority.

Yours faithfully,

${data.fullName || '[Your Name]'}

---

Note: Keep a copy of this letter and proof of delivery (registered post / courier receipt) for your records.`;
}
