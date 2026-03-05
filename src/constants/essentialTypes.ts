export type EssentialType = 'EMERGENCY_FUND' | 'TERM_INSURANCE' | 'HEALTH_INSURANCE';

export const ESSENTIAL_TYPES: { value: EssentialType; label: string; icon: string; description: string }[] = [
  {
    value: 'EMERGENCY_FUND',
    label: 'Emergency Fund',
    icon: '🛟',
    description: 'Cover 3–6 months of expenses',
  },
  {
    value: 'TERM_INSURANCE',
    label: 'Term Insurance',
    icon: '🛡️',
    description: 'Life cover for your dependents',
  },
  {
    value: 'HEALTH_INSURANCE',
    label: 'Health Insurance',
    icon: '🏥',
    description: 'Medical coverage for you & family',
  },
];

