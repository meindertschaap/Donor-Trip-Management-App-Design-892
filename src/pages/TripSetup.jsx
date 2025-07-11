import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiMapPin, FiUsers, FiSave, FiArrowLeft } = FiIcons;

const defaultTasks = [
  {
    title: 'Obtain visa letters',
    category: 'Documentation',
    dueOffset: -120, // 4 months before
    priority: 'high',
    description: 'Request and receive visa invitation letters for all countries'
  },
  {
    title: 'Book flights',
    category: 'Travel',
    dueOffset: -90,
    priority: 'high',
    description: 'Book international and domestic flights'
  },
  {
    title: 'Arrange accommodation',
    category: 'Travel',
    dueOffset: -75,
    priority: 'medium',
    description: 'Book hotels and guest house accommodations'
  },
  {
    title: 'Prepare presentation materials',
    category: 'Content',
    dueOffset: -60,
    priority: 'high',
    description: 'Create slides, videos, and supporting materials'
  },
  {
    title: 'Schedule donor meetings',
    category: 'Meetings',
    dueOffset: -45,
    priority: 'high',
    description: 'Coordinate meetings with major donors and prospects'
  },
  {
    title: 'Finalize event venues',
    category: 'Events',
    dueOffset: -30,
    priority: 'medium',
    description: 'Confirm venues for fundraising events'
  },
  {
    title: 'Send save-the-date notifications',
    category: 'Communications',
    dueOffset: -30,
    priority: 'medium',
    description: 'Notify attendees about upcoming events'
  },
  {
    title: 'Prepare travel insurance',
    category: 'Documentation',
    dueOffset: -14,
    priority: 'medium',
    description: 'Arrange comprehensive travel insurance'
  },
  {
    title: 'Final event confirmations',
    category: 'Events',
    dueOffset: -7,
    priority: 'high',
    description: 'Confirm all event details and logistics'
  },
  {
    title: 'Send thank you notes',
    category: 'Communications',
    dueOffset: 3,
    priority: 'high',
    description: 'Send personalized thank you messages to all contacts'
  },
  {
    title: 'Follow up on pledges',
    category: 'Fundraising',
    dueOffset: 14,
    priority: 'high',
    description: 'Contact donors to confirm and collect pledges'
  },
  {
    title: 'Compile trip report',
    category: 'Reporting',
    dueOffset: 30,
    priority: 'medium',
    description: 'Create comprehensive trip report with metrics and learnings'
  }
];

function TripSetup() {
  const navigate = useNavigate();
  const { addTrip, addTask } = useTrip();
  const { success } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    destinations: [{ country: '', cities: [''] }],
    teamMembers: ['']
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDestinationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => 
        i === index ? { ...dest, [field]: value } : dest
      )
    }));
  };

  const handleCityChange = (destIndex, cityIndex, value) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => 
        i === destIndex 
          ? { 
              ...dest, 
              cities: dest.cities.map((city, j) => j === cityIndex ? value : city)
            }
          : dest
      )
    }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { country: '', cities: [''] }]
    }));
  };

  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      setFormData(prev => ({
        ...prev,
        destinations: prev.destinations.filter((_, i) => i !== index)
      }));
    }
  };

  const addCity = (destIndex) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => 
        i === destIndex 
          ? { ...dest, cities: [...dest.cities, ''] }
          : dest
      )
    }));
  };

  const removeCity = (destIndex, cityIndex) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.map((dest, i) => 
        i === destIndex 
          ? { ...dest, cities: dest.cities.filter((_, j) => j !== cityIndex) }
          : dest
      )
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const calculateDueDate = (startDate, offset) => {
    const start = new Date(startDate);
    const due = new Date(start);
    due.setDate(due.getDate() + offset);
    return due.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the trip
      const tripData = {
        ...formData,
        destinations: formData.destinations.filter(dest => 
          dest.country.trim() && dest.cities.some(city => city.trim())
        ).map(dest => ({
          ...dest,
          cities: dest.cities.filter(city => city.trim())
        })),
        teamMembers: formData.teamMembers.filter(m => m.trim()),
        status: 'planning',
        createdAt: new Date().toISOString()
      };

      addTrip(tripData);

      // Create default tasks
      const tripId = Date.now().toString(); // Simple ID generation
      defaultTasks.forEach(task => {
        const taskData = {
          ...task,
          tripId,
          status: 'not-started',
          dueDate: calculateDueDate(formData.startDate, task.dueOffset),
          assignee: formData.teamMembers[0] || 'Unassigned',
          createdAt: new Date().toISOString()
        };
        addTask(taskData);
      });

      success('Trip created successfully! Timeline and tasks have been generated.');
      navigate('/');
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <Button
          variant="outline"
          icon={FiArrowLeft}
          onClick={() => navigate('/')}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Trip</h1>
        <p className="text-gray-600">Set up your trip details and we'll generate a complete timeline and task list</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiCalendar} className="mr-2" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., East Africa Donor Trip 2024"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Destinations */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiMapPin} className="mr-2" />
            Destinations
          </h2>
          
          <div className="space-y-4">
            {formData.destinations.map((destination, destIndex) => (
              <div key={destIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Destination {destIndex + 1}</h4>
                  {formData.destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDestination(destIndex)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={destination.country}
                      onChange={(e) => handleDestinationChange(destIndex, 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., Kenya"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cities in {destination.country || 'this country'}
                    </label>
                    <div className="space-y-2">
                      {destination.cities.map((city, cityIndex) => (
                        <div key={cityIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => handleCityChange(destIndex, cityIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., Nairobi"
                          />
                          {destination.cities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCity(destIndex, cityIndex)}
                              className="text-red-500 hover:text-red-700 text-sm px-2"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCity(destIndex)}
                      >
                        Add City
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addDestination}
            >
              Add Destination
            </Button>
          </div>
        </Card>

        {/* Team */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiUsers} className="mr-2" />
            Team Members
          </h2>
          
          <div className="space-y-2">
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => handleArrayChange('teamMembers', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., John Doe"
                />
                {formData.teamMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('teamMembers', index)}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('teamMembers')}
            >
              Add Team Member
            </Button>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={FiSave}
            loading={loading}
          >
            Create Trip & Generate Timeline
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export default TripSetup;