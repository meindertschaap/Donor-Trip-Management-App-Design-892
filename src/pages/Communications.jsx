import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiMail, FiSend, FiClock, FiEdit3, FiTrash2, FiEye } = FiIcons;

function CommunicationCard({ communication, onEdit, onDelete, onView }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return FiMail;
      case 'thank-you': return FiIcons.FiHeart;
      case 'save-date': return FiIcons.FiCalendar;
      case 'visa-invite': return FiIcons.FiFileText;
      case 'follow-up': return FiIcons.FiRepeat;
      default: return FiMail;
    }
  };

  return (
    <Card className="hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <SafeIcon 
              icon={getTypeIcon(communication.type)} 
              className="h-5 w-5 text-primary-600" 
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {communication.subject}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              To: {communication.recipients?.join(', ') || 'No recipients'}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiClock} className="h-4 w-4" />
                <span>{new Date(communication.createdAt).toLocaleDateString()}</span>
              </div>
              <StatusBadge status={communication.status} size="sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onView(communication)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <SafeIcon icon={FiEye} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(communication)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <SafeIcon icon={FiEdit3} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(communication.id)}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {communication.type}
          </span>
          {communication.scheduledFor && (
            <span className="text-xs text-gray-500">
              Scheduled: {new Date(communication.scheduledFor).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function CommunicationModal({ communication, isOpen, onClose, onSave }) {
  const { currentTrip } = useTrip();
  const [formData, setFormData] = useState(
    communication || {
      subject: '',
      type: 'email',
      recipients: [''],
      content: '',
      status: 'draft',
      scheduledFor: '',
      template: ''
    }
  );

  React.useEffect(() => {
    if (communication) {
      setFormData(communication);
    }
  }, [communication]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tripId: currentTrip?.id,
      recipients: formData.recipients.filter(r => r.trim()),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleRecipientChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => i === index ? value : recipient)
    }));
  };

  const addRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const removeRecipient = (index) => {
    if (formData.recipients.length > 1) {
      setFormData(prev => ({
        ...prev,
        recipients: prev.recipients.filter((_, i) => i !== index)
      }));
    }
  };

  const templates = {
    'save-date': {
      subject: 'Save the Date - {Trip Name}',
      content: 'Dear {Name},\n\nWe are excited to invite you to join us for our upcoming trip to {Destination}.\n\nDates: {Start Date} - {End Date}\n\nMore details to follow soon.\n\nBest regards,\n{Your Name}'
    },
    'thank-you': {
      subject: 'Thank You - {Trip Name}',
      content: 'Dear {Name},\n\nThank you so much for taking the time to meet with us during our recent trip to {Destination}.\n\nYour support means the world to us and the communities we serve.\n\nWe look forward to staying in touch.\n\nWith gratitude,\n{Your Name}'
    },
    'visa-invite': {
      subject: 'Visa Invitation Letter - {Trip Name}',
      content: 'Dear {Name},\n\nPlease find attached your visa invitation letter for our upcoming trip to {Destination}.\n\nTrip Details:\n- Dates: {Start Date} - {End Date}\n- Purpose: {Purpose}\n\nPlease process your visa application at your earliest convenience.\n\nBest regards,\n{Your Name}'
    }
  };

  const loadTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setFormData(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content,
        type: templateKey
      }));
    }
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
          {communication ? 'Edit Communication' : 'Create New Communication'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="email">General Email</option>
                <option value="save-date">Save the Date</option>
                <option value="thank-you">Thank You</option>
                <option value="visa-invite">Visa Invitation</option>
                <option value="follow-up">Follow Up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                value={formData.template}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, template: e.target.value }));
                  if (e.target.value) loadTemplate(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select template (optional)</option>
                <option value="save-date">Save the Date</option>
                <option value="thank-you">Thank You</option>
                <option value="visa-invite">Visa Invitation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Email subject line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients
            </label>
            {formData.recipients.map((recipient, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => handleRecipientChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="recipient@example.com"
                />
                {formData.recipients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
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
              onClick={addRecipient}
            >
              Add Recipient
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Email content..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule For (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {communication ? 'Update' : 'Create'} Communication
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Communications() {
  const { currentTrip, communications, addCommunication } = useTrip();
  const { success } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCommunication, setEditingCommunication] = useState(null);
  const [filter, setFilter] = useState('all');

  const tripCommunications = communications.filter(comm => comm.tripId === currentTrip?.id);

  const filteredCommunications = tripCommunications.filter(comm => {
    if (filter === 'all') return true;
    return comm.status === filter;
  });

  const handleEdit = (communication) => {
    setEditingCommunication(communication);
    setModalOpen(true);
  };

  const handleDelete = (communicationId) => {
    if (confirm('Are you sure you want to delete this communication?')) {
      success('Communication deleted successfully');
    }
  };

  const handleView = (communication) => {
    // In a real app, this would open a preview modal
    success('Opening communication preview');
  };

  const handleSave = (communicationData) => {
    if (editingCommunication) {
      success('Communication updated successfully');
    } else {
      addCommunication(communicationData);
      success('Communication created successfully');
    }
    setEditingCommunication(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCommunication(null);
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiMail} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to manage communications.</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage emails and communications for {currentTrip.name}</p>
        </div>
        <Button
          icon={FiPlus}
          onClick={() => setModalOpen(true)}
        >
          New Communication
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Communications</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
          </select>
        </div>
      </Card>

      {filteredCommunications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunications.map((communication, index) => (
            <motion.div
              key={communication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CommunicationCard
                communication={communication}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <SafeIcon icon={FiMail} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Communications Found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Create your first communication to get started.'
              : `No communications with status "${filter}" found.`
            }
          </p>
          <Button
            icon={FiPlus}
            onClick={() => setModalOpen(true)}
          >
            New Communication
          </Button>
        </Card>
      )}

      <CommunicationModal
        communication={editingCommunication}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </motion.div>
  );
}

export default Communications;