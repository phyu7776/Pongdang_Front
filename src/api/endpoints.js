import axiosUtil, { refreshApi } from '../utils/axiosUtil';
import Cookies from 'js-cookie';
import useConfigStore from '../store/configStore';

// Auth APIs
export const auth = {
  login: async (userId, password) => {
    const response = await axiosUtil.post('/users/login', { userId, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await axiosUtil.post('/users/signup', userData);
    return response.data;
  },

  reissueToken: async (user) => {
    const response = await refreshApi.post('/users/reissue', user);
    if (!response.data?.token?.accessToken) {
      throw new Error("토큰 재발급 응답 형식 오류");
    }
    const configStore = useConfigStore.getState().config;
    Cookies.set("token", response.data.token.accessToken, {
      expires: configStore.liveAccessToken,
      secure: true,
      sameSite: "Strict",
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosUtil.post('/users/logout');
    return response.data;
  }
};

// User APIs
export const users = {
  getUsers: async () => {
    const response = await axiosUtil.get('/users/getUsers');
    return response.data;
  },

  updateUser: async (userData) => {
    const response = await axiosUtil.patch('/users/update', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosUtil.patch('/users/changePassword', passwordData);
    return response.data;
  },

  deleteUser: async (userList) => {
    const response = await axiosUtil.delete('/users/delete', { data: userList });
    return response.data;
  },

  approveUsers: async (approveList) => {
    const response = await axiosUtil.put('/admin/approve', approveList);
    return response.data;
  }
};

// Menu APIs
export const menus = {
  getMainMenu: async () => {
    const response = await axiosUtil.get('/menu/getMain');
    return response.data;
  },

  getMenuByUid: async (uid) => {
    const response = await axiosUtil.get(`/menu/get/${uid}`);
    return response.data;
  }
};

// Config APIs
export const config = {
  getConfig: async () => {
    const response = await axiosUtil.get('/config/getConfig');
    return response.data;
  },

  getSystemConfig: async (configType) => {
    const response = await axiosUtil.get(`/config/get/systemConfig/${configType}`);
    return response.data;
  }
}; 