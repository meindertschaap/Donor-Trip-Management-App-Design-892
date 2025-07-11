import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-amani-orange-500 to-amani-orange-600 text-white hover:from-amani-orange-600 hover:to-amani-orange-700 focus:ring-amani-orange-500 disabled:from-amani-orange-300 disabled:to-amani-orange-300',
    secondary: 'bg-gradient-to-r from-amani-blue-100 to-amani-blue-200 text-amani-blue-900 hover:from-amani-blue-200 hover:to-amani-blue-300 focus:ring-amani-blue-500 disabled:from-gray-100 disabled:to-gray-100',
    success: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 disabled:from-accent-300 disabled:to-accent-300',
    danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white hover:from-danger-600 hover:to-danger-700 focus:ring-danger-500 disabled:from-danger-300 disabled:to-danger-300',
    warning: 'bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700 focus:ring-warning-500 disabled:from-warning-300 disabled:to-warning-300',
    outline: 'border border-amani-orange-300 bg-white text-amani-orange-700 hover:bg-gradient-to-r hover:from-amani-orange-50 hover:to-amani-blue-50 focus:ring-amani-orange-500 disabled:bg-gray-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      ) : (
        icon && iconPosition === 'left' && (
          <SafeIcon icon={icon} className="w-4 h-4 mr-2" />
        )
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <SafeIcon icon={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  );
}

export default Button;