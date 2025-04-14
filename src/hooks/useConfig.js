import { useState, useEffect } from 'react';
import { config } from '../api/endpoints';
import useConfigStore from '../store/configStore';

export const useConfig = () => {
  const [loading, setLoading] = useState(true);
  const setConfig = useConfigStore((state) => state.setConfig);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await config.getConfig();
        setConfig(configData);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [setConfig]);

  return { loading };
}; 