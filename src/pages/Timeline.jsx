import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiClock, FiUser, FiFilter, FiCheck } = FiIcons;

function Timeline() {
  const { currentTrip, tasks, meetings, updateMeeting } = useTrip();
  const { success } = useNotification();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const timelineItems = useMemo(() => {
    if (!currentTrip) return [];
    
    const items = [];
    
    // Add tasks
    tasks
      .filter(task => task.tripId === currentTrip.id)
      .forEach(task => {
        items.push({
          ...task,
          type: 'task',
          date: task.dueDate,
          title: task.title,
          status: task.status
        });
      });
    
    // Add meetings
    meetings
      .filter(meeting => meeting.tripId === currentTrip.id)
      .forEach(meeting => {
        items.push({
          ...meeting,
          type: 'meeting',
          date: meeting.date,
          title: meeting.title,
          status: meeting.status
        });
      });
    
    // Sort by date
    items.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return items;
  }, [currentTrip, tasks, meetings]);

  const filteredItems = useMemo(() => {
    return timelineItems.filter(item => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      return true;
    });
  }, [timelineItems, filterStatus, filterCategory]);

  const categories = useMemo(() => {
    const cats = new Set();
    timelineItems.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [timelineItems]);

  const getItemIcon = (item) => {
    if (item.type === 'meeting') return FiUser;
    switch (item.category) {
      case 'Documentation': return FiIcons.FiFileText;
      case 'Travel': return FiIcons.FiMapPin;
      case 'Events': return FiIcons.FiCalendar;
      case 'Communications': return FiIcons.FiMail;
      case 'Fundraising': return FiIcons.FiHeart;
      default: return FiIcons.FiCheckSquare;
    }
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const itemDate = new Date(date);
    const diffTime = itemDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return 'Today';
    return `In ${diffDays} days`;
  };

  const handleToggleMeetingComplete = (meeting) => {
    const newStatus = meeting.status === 'completed' ? 'scheduled' : 'completed';
    const updatedMeeting = { ...meeting, status: newStatus };
    
    updateMeeting(updatedMeeting);
    
    if (newStatus === 'completed') {
      setSelectedMeeting(updatedMeeting);
      setNotesModalOpen(true);
      success('Meeting marked as completed. Please add meeting notes.');
    } else {
      success('Meeting marked as incomplete.');
    }
  };

  const handleSaveNotes = (notes) => {
    if (selectedMeeting) {
      updateMeeting({
        ...selectedMeeting,
        notes
      });
      success('Meeting notes saved successfully');
    }
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiCalendar} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to view the timeline.</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trip Timeline</h1>
        <p className="text-gray-600">Complete view of tasks and events for {currentTrip.name}</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline items */}
        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start"
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-medium ${
                item.status === 'completed' ? 'bg-success-500' : item.status === 'in-progress' ? 'bg-warning-500' : 'bg-gray-300'
              }`}>
                <SafeIcon icon={getItemIcon(item)} className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                <Card className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <StatusBadge status={item.status} size="sm" />
                        {item.type === 'meeting' && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                            Meeting
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-600 mb-3">{item.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="h-4 w-4" />
                          <span>{getDaysUntil(item.date)}</span>
                        </div>
                        {item.assignee && (
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiUser} className="h-4 w-4" />
                            <span>{item.assignee}</span>
                          </div>
                        )}
                        {item.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>
                      {item.location && (
                        <div className="mt-2 text-sm text-gray-600">
                          <SafeIcon icon={FiIcons.FiMapPin} className="inline h-4 w-4 mr-1" />
                          {item.location}
                        </div>
                      )}

                      {/* Add completion toggle for meetings */}
                      {item.type === 'meeting' && (
                        <div className="mt-3 flex items-center">
                          <button 
                            onClick={() => handleToggleMeetingComplete(item)}
                            className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                          >
                            <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                              item.status === 'completed' ? 'bg-success-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                              <SafeIcon icon={FiCheck} className="h-3 w-3" />
                            </div>
                            <span className="text-sm font-medium">
                              {item.status === 'completed' ? 'Completed' : 'Mark Complete'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="text-center py-12">
            <SafeIcon icon={FiCalendar} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600">No timeline items match your current filters.</p>
          </Card>
        )}
      </div>

      {/* Notes Modal - Reusing the one from Meetings.jsx */}
      {notesModalOpen && selectedMeeting && (
        <NotesViewModal
          meeting={selectedMeeting}
          isOpen={notesModalOpen}
          onClose={() => setNotesModalOpen(false)}
          onSave={handleSaveNotes}
          isReadOnly={false}
        />
      )}
    </motion.div>
  );
}

// Notes Modal Component - Same as in Meetings.jsx
function NotesViewModal({ meeting, isOpen, onClose, onSave, isReadOnly = true }) {
  const [notes, setNotes] = useState({
    pledges: '',
    outcomes: '',
    nextActions: '',
    generalNotes: ''
  });

  React.useEffect(() => {
    if (meeting?.notes) {
      setNotes(meeting.notes);
    }
  }, [meeting]);

  const handleNotesChange = (field, value) => {
    setNotes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  if (!isOpen || !meeting) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{meeting.title}</h2>
            <p className="text-gray-600">{formatDate(meeting.date)} at {meeting.time}</p>
          </div>
          <div className="flex space-x-3">
            {!isReadOnly && (
              <button 
                onClick={handleSave}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Notes
              </button>
            )}
            <button 
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isReadOnly ? "Close" : "Cancel"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Pledges & Interests</h3>
            {isReadOnly ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {notes.pledges || 'No pledges recorded.'}
              </p>
            ) : (
              <textarea
                value={notes.pledges}
                onChange={(e) => handleNotesChange('pledges', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Record any pledges made or interests expressed..."
              />
            )}
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Important Outcomes</h3>
            {isReadOnly ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {notes.outcomes || 'No outcomes recorded.'}
              </p>
            ) : (
              <textarea
                value={notes.outcomes}
                onChange={(e) => handleNotesChange('outcomes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Key decisions, commitments, or outcomes from the meeting..."
              />
            )}
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Next Actions</h3>
            {isReadOnly ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {notes.nextActions || 'No next actions recorded.'}
              </p>
            ) : (
              <textarea
                value={notes.nextActions}
                onChange={(e) => handleNotesChange('nextActions', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Follow-up actions, who is responsible, deadlines..."
              />
            )}
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
            {isReadOnly ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {notes.generalNotes || 'No additional notes.'}
              </p>
            ) : (
              <textarea
                value={notes.generalNotes}
                onChange={(e) => handleNotesChange('generalNotes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any other important notes or observations..."
              />
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

export default Timeline;