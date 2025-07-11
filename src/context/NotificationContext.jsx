import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiX, FiAlertTriangle, FiInfo } = FiIcons;

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, newNotification.duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    success: (message, options = {}) => addNotification({ ...options, type: 'success', message }),
    error: (message, options = {}) => addNotification({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addNotification({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addNotification({ ...options, type: 'info', message }),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Notification({ notification, onRemove }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return FiCheck;
      case 'error': return FiX;
      case 'warning': return FiAlertTriangle;
      default: return FiInfo;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-accent-50 border-accent-200 text-accent-800';
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      case 'warning':
        return 'bg-amani-orange-50 border-amani-orange-200 text-amani-orange-800';
      default:
        return 'bg-amani-blue-50 border-amani-blue-200 text-amani-blue-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-sm w-full border rounded-lg p-4 shadow-medium ${getColors()}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <SafeIcon icon={getIcon()} className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          {notification.title && (
            <p className="text-sm font-medium">{notification.title}</p>
          )}
          <p className="text-sm">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => onRemove(notification.id)}
          >
            <SafeIcon icon={FiX} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}