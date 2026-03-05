import { create } from 'zustand';
import {
  Transaction, NewTransaction,
  getAllTransactions, insertTransaction, updateTransaction, deleteTransaction
} from '../db/queries/transactions';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  load: () => void;
  add: (tx: NewTransaction) => number;
  update: (id: number, tx: Partial<NewTransaction>) => void;
  remove: (id: number) => void;
  totalIncome: () => number;
  totalExpense: () => number;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  loading: false,

  load: () => {
    set({ loading: true });
    try {
      const transactions = getAllTransactions();
      set({ transactions, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  add: (tx) => {
    const id = insertTransaction(tx);
    get().load();
    return id;
  },

  update: (id, tx) => {
    updateTransaction(id, tx);
    get().load();
  },

  remove: (id) => {
    deleteTransaction(id);
    get().load();
  },

  totalIncome: () =>
    get().transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),

  totalExpense: () =>
    get().transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
}));

