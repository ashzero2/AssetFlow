import { create } from 'zustand';
import {
  Essential, NewEssential,
  getAllEssentials, insertEssential, updateEssential, deleteEssential,
  NetWorthSnapshot, getNetWorthSnapshots, upsertNetWorthSnapshot
} from '../db/queries/essentials';

interface EssentialsState {
  essentials: Essential[];
  snapshots: NetWorthSnapshot[];
  loading: boolean;
  load: () => void;
  loadSnapshots: () => void;
  add: (e: NewEssential) => number;
  update: (id: number, e: Partial<NewEssential>) => void;
  remove: (id: number) => void;
  saveSnapshot: (date: string, netWorth: number, totalAssets: number) => void;
}

export const useEssentialsStore = create<EssentialsState>((set, get) => ({
  essentials: [],
  snapshots: [],
  loading: false,

  load: () => {
    set({ loading: true });
    try {
      const essentials = getAllEssentials();
      set({ essentials, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  loadSnapshots: () => {
    const snapshots = getNetWorthSnapshots(12);
    set({ snapshots });
  },

  add: (e) => {
    const id = insertEssential(e);
    get().load();
    return id;
  },

  update: (id, e) => {
    updateEssential(id, e);
    get().load();
  },

  remove: (id) => {
    deleteEssential(id);
    get().load();
  },

  saveSnapshot: (date, netWorth, totalAssets) => {
    upsertNetWorthSnapshot(date, netWorth, totalAssets);
    get().loadSnapshots();
  },
}));

