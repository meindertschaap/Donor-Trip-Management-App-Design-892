import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
// Try multiple import approaches for maximum compatibility
import amaniLogo from '../../assets/amani-logo.jpg';

const { FiHome, FiCalendar, FiCheckSquare, FiUsers, FiHeart, FiBarChart3, FiSettings } = FiIcons;

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Timeline', href: '/timeline', icon: FiCalendar },
  { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
  { name: 'Trip Planner', href: '/trip-planner', icon: FiCalendar },
  { name: 'Meetings', href: '/meetings', icon: FiUsers },
  { name: 'Pledges', href: '/pledges', icon: FiHeart },
  { name: 'Analytics', href: '/analytics', icon: FiBarChart3 },
];

function Sidebar() {
  // Fallback to a text-based logo if image fails to load
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="bg-white w-64 shadow-soft border-r border-amani-orange-100">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-amani-orange-100">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center"
          >
            {!imageError ? (
              <img
                src={amaniLogo || "/assets/amani-logo.jpg"}
                alt="Amani Logo"
                className="w-10 h-10 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-amani-orange-400 to-amani-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            )}
            <span className="text-xl font-bold text-gray-900 ml-2">Amani</span>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amani-orange-50 to-amani-blue-50 text-amani-orange-900 border-r-2 border-amani-orange-500'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-amani-orange-50 hover:to-amani-blue-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <SafeIcon
                      icon={item.icon}
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-amani-orange-600' : 'text-gray-400 group-hover:text-amani-orange-500'
                      }`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Settings */}
        <div className="p-2 border-t border-amani-orange-100">
          <NavLink
            to="/settings"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gradient-to-r hover:from-amani-orange-50 hover:to-amani-blue-50 hover:text-gray-900 transition-colors duration-200"
          >
            <SafeIcon icon={FiSettings} className="mr-3 h-5 w-5 text-gray-400 group-hover:text-amani-orange-500" />
            Settings
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;