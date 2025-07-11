import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCalendar, FiMapPin, FiUsers, FiClock, FiEdit3, FiTrash2, FiFileText, FiCheck, FiX } = FiIcons;

function MeetingCard({ meeting, onEdit, onDelete, onViewNotes, onToggleComplete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiCalendar} className="h-4 w-4" />
              <span>{formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className="h-4 w-4" />
              <span>{meeting.time}</span>
            </div>
            {meeting.location && (
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiMapPin} className="h-4 w-4" />
                <span>{meeting.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={meeting.status} />
            
            {/* Complete/Uncomplete toggle button */}
            <button 
              onClick={() => onToggleComplete(meeting)}
              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                meeting.status === 'completed' 
                  ? 'bg-success-500 text-white hover:bg-success-600' 
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              } transition-colors duration-200`}
              title={meeting.status === 'completed' ? "Mark as incomplete" : "Mark as completed"}
            >
              <SafeIcon icon={meeting.status === 'completed' ? FiCheck : FiCheck} className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {meeting.notes && Object.values(meeting.notes).some(note => note.trim()) && (
            <button 
              onClick={() => onViewNotes(meeting)} 
              className="text-gray-400 hover:text-gray-600 p-2" 
              title="View Notes"
            >
              <SafeIcon icon={FiFileText} className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => onEdit(meeting)} 
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <SafeIcon icon={FiEdit3} className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(meeting.id)} 
            className="text-gray-400 hover:text-red-600 p-2"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>
      {meeting.description && (
        <p className="text-gray-600 mb-4">{meeting.description}</p>
      )}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUsers} className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {meeting.type || 'Meeting'}
            </span>
          </div>
          {meeting.type && (
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
              {meeting.type}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function MeetingModal({ meeting, isOpen, onClose, onSave }) {
  const { currentTrip } = useTrip();
  const [formData, setFormData] = useState(
    meeting || {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'Major Donor Meeting',
      status: 'scheduled',
      agenda: '',
      notes: {
        pledges: '',
        outcomes: '',
        nextActions: '',
        generalNotes: ''
      }
    }
  );

  React.useEffect(() => {
    if (meeting) {
      setFormData({
        ...meeting,
        notes: meeting.notes || {
          pledges: '',
          outcomes: '',
          nextActions: '',
          generalNotes: ''
        }
      });
    }
  }, [meeting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tripId: currentTrip?.id,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleNotesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      notes: { ...prev.notes, [field]: value }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {meeting ? 'Edit Meeting' : 'Schedule New Meeting'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Donor Meeting with Foundation XYZ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief description of the meeting purpose"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Major Donor Meeting">Major Donor Meeting</option>
                <option value="Fundraising Event">Fundraising Event</option>
                <option value="FOA Board Meeting">FOA Board Meeting</option>
                <option value="(Semi-)Informal Meeting">(Semi-)Informal Meeting</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Meeting venue or address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agenda
            </label>
            <textarea
              value={formData.agenda}
              onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Meeting agenda and talking points"
            />
          </div>

          {/* Meeting Notes Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pledges & Interests
                </label>
                <textarea
                  value={formData.notes.pledges}
                  onChange={(e) => handleNotesChange('pledges', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Record any pledges made or interests expressed..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Important Outcomes
                </label>
                <textarea
                  value={formData.notes.outcomes}
                  onChange={(e) => handleNotesChange('outcomes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Key decisions, commitments, or outcomes from the meeting..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Actions
                </label>
                <textarea
                  value={formData.notes.nextActions}
                  onChange={(e) => handleNotesChange('nextActions', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Follow-up actions, who is responsible, deadlines..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes.generalNotes}
                  onChange={(e) => handleNotesChange('generalNotes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any other important notes or observations..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {meeting ? 'Update Meeting' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

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
              <Button onClick={handleSave}>
                Save Notes
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              {isReadOnly ? "Close" : "Cancel"}
            </Button>
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

function Meetings() {
  const { currentTrip, meetings, addMeeting, updateMeeting, deleteMeeting } = useTrip();
  const { success } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [viewingMeeting, setViewingMeeting] = useState(null);
  const [filter, setFilter] = useState('all');
  const [notesReadOnly, setNotesReadOnly] = useState(true);

  const tripMeetings = meetings.filter(meeting => meeting.tripId === currentTrip?.id);
  const filteredMeetings = tripMeetings.filter(meeting => {
    if (filter === 'all') return true;
    return meeting.status === filter;
  });

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setModalOpen(true);
  };

  const handleViewNotes = (meeting) => {
    setViewingMeeting(meeting);
    setNotesReadOnly(true);
    setNotesModalOpen(true);
  };

  const handleToggleComplete = (meeting) => {
    const newStatus = meeting.status === 'completed' ? 'scheduled' : 'completed';
    const updatedMeeting = { ...meeting, status: newStatus };
    
    updateMeeting(updatedMeeting);
    
    // If marking as completed, prompt for notes
    if (newStatus === 'completed') {
      setViewingMeeting(updatedMeeting);
      setNotesReadOnly(false);
      setNotesModalOpen(true);
      success('Meeting marked as completed. Please add meeting notes.');
    } else {
      success('Meeting marked as incomplete.');
    }
  };

  const handleDelete = (meetingId) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      deleteMeeting(meetingId);
      success('Meeting deleted successfully');
    }
  };

  const handleSave = (meetingData) => {
    if (editingMeeting) {
      updateMeeting({ ...editingMeeting, ...meetingData });
      success('Meeting updated successfully');
    } else {
      addMeeting(meetingData);
      success('Meeting scheduled successfully');
    }
    setEditingMeeting(null);
  };

  const handleSaveNotes = (notes) => {
    if (viewingMeeting) {
      updateMeeting({
        ...viewingMeeting,
        notes
      });
      success('Meeting notes saved successfully');
    }
  };

  const handleAddNotes = (meeting) => {
    setViewingMeeting(meeting);
    setNotesReadOnly(false);
    setNotesModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMeeting(null);
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiUsers} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to manage meetings.</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings & Events</h1>
          <p className="text-gray-600">Schedule and manage meetings for {currentTrip.name}</p>
        </div>
        <Button icon={FiPlus} onClick={() => setModalOpen(true)}>
          Schedule Meeting
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Meetings</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Meetings Grid */}
      {filteredMeetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MeetingCard
                meeting={meeting}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewNotes={handleViewNotes}
                onToggleComplete={handleToggleComplete}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <SafeIcon icon={FiCalendar} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meetings Scheduled</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? 'Get started by scheduling your first meeting or event.'
              : `No meetings with status "${filter}" found.`}
          </p>
          <Button icon={FiPlus} onClick={() => setModalOpen(true)}>
            Schedule Meeting
          </Button>
        </Card>
      )}

      {/* Meeting Modal */}
      <MeetingModal
        meeting={editingMeeting}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      {/* Notes View/Edit Modal */}
      <NotesViewModal
        meeting={viewingMeeting}
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        onSave={handleSaveNotes}
        isReadOnly={notesReadOnly}
      />
    </motion.div>
  );
}

export default Meetings;