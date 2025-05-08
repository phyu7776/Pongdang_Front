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
  },

  getFullMenuTree: async () => {
    const response = await axiosUtil.get('/menu/getFullMenuTree');
    return response.data;
  },

  updateMenu: async (menu) => {
    const response = await axiosUtil.put('/menu/update', menu);
    return response.data;
  },

  deleteMenu: async (menuId) => {
    const response = await axiosUtil.delete('/menu/delete', { data: { id: menuId } });
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

// Board APIs
export const boards = {
  getBoardList: async (page = 0, limit = 20) => {
    const response = await axiosUtil.get('/board/getList', {
      params: {
        page,
        limit
      }
    });
    return response.data;
  },

  getBoardDetail: async (boardId) => {
    const response = await axiosUtil.get(`/board/get/${boardId}`);
    return response.data;
  },

  createBoard: async (boardData) => {
    const response = await axiosUtil.post('/board/create', boardData);
    return response.data;
  },

  updateBoard: async (boardData) => {
    const response = await axiosUtil.put(`/board/edit`, boardData);
    return response.data;
  },

  deleteBoard: async (uid) => {
    try {
      const response = await axiosUtil.delete(`/board/delete/${uid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPosts: (boardId, params) => axiosUtil.get(`/board/${boardId}/posts`, { params }),
  createPost: (boardId, data) => axiosUtil.post(`/board/${boardId}/post`, data),
  updatePost: (boardId, postId, data) => axiosUtil.put(`/board/${boardId}/post/${postId}`, data),
  deletePost: (boardId, postId) => axiosUtil.delete(`/board/${boardId}/post/${postId}`),
};

// Lesson APIs
export const lessons = {
  getLessonList: async (page = 0, limit = 20) => {
    const response = await axiosUtil.get('/lesson/getList', {
      params: {
        page,
        limit
      }
    });
    return response.data;
  },

  getLessonDetail: async (lessonId) => {
    const response = await axiosUtil.get(`/lesson/get/${lessonId}`);
    return response.data;
  },

  createLesson: async (lessonData) => {
    const response = await axiosUtil.post('/lesson/create', lessonData);
    return response.data;
  },

  updateLesson: async (lessonData) => {
    const response = await axiosUtil.put(`/lesson/edit`, lessonData);
    return response.data;
  },

  deleteLesson: async (uid) => {
    try {
      const response = await axiosUtil.delete(`/lesson/delete/${uid}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  reserveLesson: async (lessonId, userId) => {
    const response = await axiosUtil.post(`/lesson/reserve`, {
      lessonId,
      userId
    });
    return response.data;
  },

  cancelReservation: async (lessonId, userId) => {
    const response = await axiosUtil.post(`/lesson/cancel`, {
      lessonId,
      userId
    });
    return response.data;
  }
};

// Geo APIs
export const geo = {
  createGeoData: async (geoData) => {
    const response = await axiosUtil.post('/geo/create', geoData);
    return response.data;
  },
  
  deleteGeoData: async (id) => {
    const response = await axiosUtil.delete(`/geo/delete/${id}`);
    return response.data;
  },
  
  getGeoList: async () => {
    const response = await axiosUtil.get('/geo/getList');
    return response.data;
  }
}; 