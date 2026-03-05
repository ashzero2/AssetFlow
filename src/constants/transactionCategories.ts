export type TransactionCategory =
  | 'SALARY'
  | 'FREELANCE'
  | 'INVESTMENT_RETURN'
  | 'RENTAL'
  | 'BUSINESS'
  | 'OTHER_INCOME'
  | 'FOOD'
  | 'TRANSPORT'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'EDUCATION'
  | 'RENT'
  | 'UTILITIES'
  | 'INSURANCE'
  | 'INVESTMENT'
  | 'EMI'
  | 'TRAVEL'
  | 'PERSONAL'
  | 'OTHER_EXPENSE';

export const INCOME_CATEGORIES: { value: TransactionCategory; label: string; icon: string }[] = [
  { value: 'SALARY', label: 'Salary', icon: '💼' },
  { value: 'FREELANCE', label: 'Freelance', icon: '🖥️' },
  { value: 'INVESTMENT_RETURN', label: 'Investment Return', icon: '📈' },
  { value: 'RENTAL', label: 'Rental Income', icon: '🏠' },
  { value: 'BUSINESS', label: 'Business', icon: '🏢' },
  { value: 'OTHER_INCOME', label: 'Other Income', icon: '💰' },
];

export const EXPENSE_CATEGORIES: { value: TransactionCategory; label: string; icon: string }[] = [
  { value: 'FOOD', label: 'Food & Dining', icon: '🍽️' },
  { value: 'TRANSPORT', label: 'Transport', icon: '🚗' },
  { value: 'SHOPPING', label: 'Shopping', icon: '🛍️' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', icon: '🎬' },
  { value: 'HEALTH', label: 'Health', icon: '🏥' },
  { value: 'EDUCATION', label: 'Education', icon: '📚' },
  { value: 'RENT', label: 'Rent', icon: '🏡' },
  { value: 'UTILITIES', label: 'Utilities', icon: '💡' },
  { value: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { value: 'INVESTMENT', label: 'Investment', icon: '💹' },
  { value: 'EMI', label: 'EMI / Loan', icon: '🏦' },
  { value: 'TRAVEL', label: 'Travel', icon: '✈️' },
  { value: 'PERSONAL', label: 'Personal Care', icon: '💆' },
  { value: 'OTHER_EXPENSE', label: 'Other', icon: '📌' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategoryInfo(cat: string) {
  return ALL_CATEGORIES.find(c => c.value === cat) ?? { value: cat, label: cat, icon: '📌' };
}

