// src/store/configStore.js
import { create } from 'zustand';

const useConfigStore = create((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));

export default useConfigStore;
