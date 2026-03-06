import { create } from 'zustand';
import {
  Asset, NewAsset,
  getAllAssets, insertAsset, updateAsset, deleteAsset,
  updatePriceByTicker, updatePriceByName,
} from '../db/queries/assets';

interface AssetsState {
  assets: Asset[];
  loading: boolean;
  load: () => void;
  add: (asset: NewAsset) => number;
  update: (id: number, asset: Partial<NewAsset>) => void;
  remove: (id: number) => void;
  totalValue: () => number;
  /**
   * Updates current_price (and recalculates current_value) for every lot
   * sharing the same group key in a single DB write, then reloads the store.
   * @param groupKey  ticker string (if isTicker) or asset name
   * @param isTicker  true → match by ticker column; false → match by name
   * @param newPrice  new current price per unit
   * @returns number of rows updated
   */
  updateGroupPrice: (groupKey: string, isTicker: boolean, newPrice: number) => number;
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

  updateGroupPrice: (groupKey, isTicker, newPrice) => {
    const changed = isTicker
      ? updatePriceByTicker(groupKey, newPrice)
      : updatePriceByName(groupKey, newPrice);
    get().load();
    return changed;
  },
}));

