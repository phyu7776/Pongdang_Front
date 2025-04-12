import { useState, useEffect } from 'react';
import useConfigStore from '../store/configStore';
import axiosUtil from '../utils/axiosUtil';

export const useConfig = () => {
  const [loading, setLoading] = useState(true);
  const setConfig = useConfigStore((state) => state.setConfig);
  const config = useConfigStore((state) => state.config);
  const isConfigLoaded = useConfigStore((state) => state.isLoaded);
  const setIsLoaded = useConfigStore((state) => state.setIsLoaded);

  useEffect(() => {
    const fetchConfig = async () => {
      if (isConfigLoaded) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosUtil.get("/config/getConfig");
        setConfig(response.data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Config 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [isConfigLoaded, setConfig, setIsLoaded]);

  return {
    loading,
    config
  };
}; 