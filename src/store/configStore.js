// src/store/configStore.js
import { create } from 'zustand';

const useConfigStore = create((set) => ({
  config: null,
  isLoaded: false,
  setConfig: (config) => set({ config }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  reset: () => set({ config: null, isLoaded: false })
}));

export default useConfigStore;
