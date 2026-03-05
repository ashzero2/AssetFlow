import { create } from 'zustand';
import { Asset, NewAsset, getAllAssets, insertAsset, updateAsset, deleteAsset } from '../db/queries/assets';

interface AssetsState {
  assets: Asset[];
  loading: boolean;
  load: () => void;
  add: (asset: NewAsset) => number;
  update: (id: number, asset: Partial<NewAsset>) => void;
  remove: (id: number) => void;
  totalValue: () => number;
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
  assets: [],
  loading: false,

  load: () => {
    set({ loading: true });
    try {
      const assets = getAllAssets();
      set({ assets, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  add: (asset) => {
    const id = insertAsset(asset);
    get().load();
    return id;
  },

  update: (id, asset) => {
    updateAsset(id, asset);
    get().load();
  },

  remove: (id) => {
    deleteAsset(id);
    get().load();
  },

  totalValue: () => get().assets.reduce((sum, a) => sum + (a.current_value ?? 0), 0),
}));

