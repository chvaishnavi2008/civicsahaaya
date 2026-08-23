import type { Scheme, SchemeEligibilityResult } from './types';
import { schemes } from './schemes';

export function searchSchemes(query: string): Scheme[] {
  if (!query.trim()) return schemes;
  const q = query.toLowerCase().trim();
  return schemes.filter((s) => {
    if (s.name.toLowerCase().includes(q)) return true;
    if (s.category.toLowerCase().includes(q)) return true;
    if (s.description.toLowerCase().includes(q)) return true;
    return s.keywords.some((kw) => kw.includes(q) || q.includes(kw));
  });
}

export function checkEligibility(
  scheme: Scheme,
  answers: Record<string, string>,
): SchemeEligibilityResult {
  const matched: string[] = [];
  const not_matched: string[] = [];
  const missing_info: string[] = [];

  for (const condition of scheme.eligibility) {
    const answer = answers[condition.field];

    if (!answer || answer.trim() === '') {
      missing_info.push(condition.label);
      continue;
    }

    const result = evaluateCondition(scheme.id, condition.field, answer);
    if (result === 'match') {
      matched.push(`${condition.label}: ${answer}`);
    } else if (result === 'no_match') {
      not_matched.push(`${condition.label}: ${answer}`);
    } else {
      missing_info.push(condition.label);
    }
  }

  let status: 'eligible' | 'more_info' | 'not_eligible';
  if (not_matched.length > 0) {
    status = 'not_eligible';
  } else if (missing_info.length > 0) {
    status = 'more_info';
  } else {
    status = 'eligible';
  }

  return {
    scheme,
    status,
    matched,
    not_matched,
    missing_info,
    required_documents: scheme.required_documents,
    application_steps: scheme.application_steps,
    official_source: scheme.official_source,
    disclaimer:
      'Based on the information you provided, you appear to meet the listed eligibility conditions. Final eligibility is determined by the relevant government authority. This is not a legally binding eligibility decision.',
  };
}

function evaluateCondition(
  schemeId: string,
  field: string,
  answer: string,
): 'match' | 'no_match' | 'unknown' {
  const a = answer.toLowerCase().trim();

  // PM-JAY
  if (schemeId === 'pmjay') {
    if (field === 'citizen') return a === 'yes' ? 'match' : 'no_match';
    if (field === 'income') return a.startsWith('below') || a.includes('2.5') ? 'match' : a.includes('2.5') ? 'match' : 'no_match';
    if (field === 'secc') return a === 'yes' ? 'match' : a === 'not sure' ? 'unknown' : 'no_match';
    if (field === 'occupation') return ['casual labour', 'daily wage', 'agriculture', 'unemployed'].includes(a) ? 'match' : 'no_match';
  }

  // PMAY
  if (schemeId === 'pmay') {
    if (field === 'own_house') return a === 'no' ? 'match' : 'no_match';
    if (field === 'income') {
      if (a.includes('below') || a.includes('3 lakh') || a.includes('3–6') || a.includes('6–12')) return 'match';
      return 'no_match';
    }
    if (field === 'female_coowner') return a === 'yes' ? 'match' : 'no_match';
    if (field === 'area') return 'match';
  }

  // MGNREGA
  if (schemeId === 'nrega') {
    if (field === 'area') return a === 'rural' ? 'match' : 'no_match';
    if (field === 'willing_work') return a === 'yes' ? 'match' : 'no_match';
    if (field === 'residence') return a === 'yes' ? 'match' : 'no_match';
    if (field === 'registered') return a === 'yes' ? 'match' : a === 'not sure' ? 'unknown' : 'no_match';
  }

  // NSAP
  if (schemeId === 'nsap') {
    if (field === 'age') {
      const age = parseInt(answer, 10);
      if (isNaN(age)) return 'unknown';
      return age >= 60 ? 'match' : 'no_match';
    }
    if (field === 'category') return a === 'none of these' ? 'no_match' : 'match';
    if (field === 'bpl') return a === 'yes' ? 'match' : a === 'not sure' ? 'unknown' : 'no_match';
    if (field === 'state') return answer.trim().length > 1 ? 'match' : 'unknown';
  }

  // PM-KISAN
  if (schemeId === 'pm-kisan') {
    if (field === 'land_ownership') return a === 'yes' ? 'match' : 'no_match';
    if (field === 'occupation') return a === 'farmer' ? 'match' : 'no_match';
    if (field === 'institutional') return a === 'no' ? 'match' : 'no_match';
    if (field === 'govt_employee') return a === 'no' ? 'match' : 'no_match';
  }

  // Sukanya Samriddhi
  if (schemeId === 'sukanya') {
    if (field === 'girl_age') {
      const age = parseInt(answer, 10);
      if (isNaN(age)) return 'unknown';
      return age < 10 ? 'match' : 'no_match';
    }
    if (field === 'citizen') return a === 'yes' ? 'match' : 'no_match';
    if (field === 'opened_before_10') return a === 'yes' ? 'match' : a === 'not yet opened' ? 'match' : 'no_match';
  }

  return 'unknown';
}
