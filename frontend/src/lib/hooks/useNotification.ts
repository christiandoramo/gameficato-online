// frontend/src/lib/hooks/useNotification.ts
import { notification as notificationAntd } from 'antd';
import { useEffect } from 'react';

import { useGlobalContext } from '../contexts/globalContext';

export const useNotification = () => {
  const [api, contextHolder] = notificationAntd.useNotification();
  const { notification } = useGlobalContext();

  useEffect(() => {
    if (notification?.message && notification.type) {
      api[notification.type]({
        message: `${notification.message}`,
        description: notification.description,
        placement: 'top',
      });
    }
  }, [notification]);

  return {
    api,
    contextHolder,
  };
};