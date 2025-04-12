// src/store/menuStore.js
import { create } from 'zustand';
import axiosUtil from '../utils/axiosUtil';

export const useMenuStore = create((set) => ({
  menus: [],
  isLoading: false,
  fetchMenus: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosUtil.get('/menu/getMain');
      set({ menus: response.data });
    } catch (error) {
      console.error('메뉴 불러오기 실패:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
