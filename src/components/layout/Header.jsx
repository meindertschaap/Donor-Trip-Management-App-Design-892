import React from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../../context/TripContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiUser, FiChevronDown } = FiIcons;

function Header() {
  const { currentTrip } = useTrip();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDestinations = (destinations) => {
    if (!destinations || destinations.length === 0) return '';
    return destinations.map(dest => {
      const cities = dest.cities.join(', ');
      return cities ? `${cities} (${dest.country})` : dest.country;
    }).join(' • ');
  };

  return (
    <header className="bg-white shadow-soft border-b border-amani-orange-100 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Trip Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          {currentTrip ? (
            <>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentTrip.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {formatDestinations(currentTrip.destinations)} • {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
                </p>
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Trip Command Center
              </h1>
              <p className="text-sm text-gray-500">
                Select or create a trip to get started
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-400 hover:text-amani-orange-600 rounded-lg hover:bg-gradient-to-r hover:from-amani-orange-50 hover:to-amani-blue-50 transition-colors duration-200"
          >
            <SafeIcon icon={FiBell} className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amani-orange-500 rounded-full"></span>
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gradient-to-r hover:from-amani-orange-50 hover:to-amani-blue-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amani-orange-400 to-amani-orange-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">Admin User</span>
              <SafeIcon icon={FiChevronDown} className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;