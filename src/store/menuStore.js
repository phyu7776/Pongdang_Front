// src/store/menuStore.js
import { create } from 'zustand';
import { menus } from '../api/endpoints';

export const useMenuStore = create((set) => ({
  menus: [],
  isLoading: false,
  fetchMenus: async () => {
    set({ isLoading: true });
    try {
      const response = await menus.getMainMenu();
      set({ menus: response });
    } catch (error) {
      console.error('Error fetching menus:', error);
      set({ menus: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
