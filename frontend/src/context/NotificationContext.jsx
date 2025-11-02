import React, { createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const notificationManager = useNotifications();

  return (
    <NotificationContext.Provider value={notificationManager}>
      {children}
      <NotificationContainer notifications={notificationManager.notifications} removeNotification={notificationManager.removeNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, removeNotification }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <AlertCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
  };

  const colors = {
    success: 'bg-green-500/80 border-green-400',
    error: 'bg-red-500/80 border-red-400',
    warning: 'bg-yellow-500/80 border-yellow-400',
    info: 'bg-blue-500/80 border-blue-400',
  };

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            layout
            className={`flex items-center space-x-4 p-4 rounded-lg shadow-lg text-white border ${colors[notification.type] || colors.info} backdrop-blur-md w-80`}
          >
            <div className="flex-shrink-0">{icons[notification.type] || icons.info}</div>
            <div className="flex-1 text-sm font-medium">{notification.message}</div>
            <button onClick={() => removeNotification(notification.id)} className="p-1 rounded-full hover:bg-white/20">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProvider;