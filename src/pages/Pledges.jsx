import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import ProgressRing from '../components/common/ProgressRing';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiHeart, FiTarget, FiTrendingUp, FiEdit3, FiTrash2, FiPhone, FiMail } = FiIcons;

function PledgeCard({ pledge, onEdit, onDelete, onContact }) {
  return (
    <Card className="hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {pledge.donorName}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-gray-900">
              ${pledge.amount?.toLocaleString() || '0'}
            </span>
            {pledge.recurring && (
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                Recurring
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span>{new Date(pledge.datePledged).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>{pledge.type}</span>
          </div>
          <StatusBadge status={pledge.status} />
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onContact(pledge, 'email')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Send email"
          >
            <SafeIcon icon={FiMail} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onContact(pledge, 'phone')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Call"
          >
            <SafeIcon icon={FiPhone} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(pledge)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <SafeIcon icon={FiEdit3} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(pledge.id)}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {pledge.notes && (
        <p className="text-sm text-gray-600 mb-3">{pledge.notes}</p>
      )}

      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {pledge.type}
          </span>
          {pledge.followUpDate && (
            <span className="text-xs text-gray-500">
              Follow up: {new Date(pledge.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function PledgeModal({ pledge, isOpen, onClose, onSave }) {
  const { currentTrip } = useTrip();
  const [formData, setFormData] = useState(
    pledge || {
      donorName: '',
      amount: '',
      type: 'one-time',
      status: 'pending',
      datePledged: new Date().toISOString().split('T')[0],
      followUpDate: '',
      recurring: false,
      recurringFrequency: 'monthly',
      contactInfo: {
        email: '',
        phone: '',
        address: ''
      },
      notes: '',
      source: 'trip-meeting'
    }
  );

  React.useEffect(() => {
    if (pledge) {
      setFormData(pledge);
    }
  }, [pledge]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tripId: currentTrip?.id,
      amount: parseFloat(formData.amount),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {pledge ? 'Edit Pledge' : 'Record New Pledge'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donor Name *
              </label>
              <input
                type="text"
                required
                value={formData.donorName}
                onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pledge Amount *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
                <option value="major-gift">Major Gift</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Pledged *
              </label>
              <input
                type="date"
                required
                value={formData.datePledged}
                onChange={(e) => setFormData(prev => ({ ...prev, datePledged: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {formData.type === 'recurring' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">
                  Recurring donation
                </label>
              </div>
              {formData.recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.recurringFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringFrequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Date
            </label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.contactInfo?.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, email: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.contactInfo?.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, phone: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Additional notes about this pledge"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {pledge ? 'Update Pledge' : 'Record Pledge'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Pledges() {
  const { currentTrip, pledges, addPledge, updatePledge, deletePledge } = useTrip();
  const { success } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPledge, setEditingPledge] = useState(null);
  const [filter, setFilter] = useState('all');

  const tripPledges = pledges.filter(pledge => pledge.tripId === currentTrip?.id);

  const filteredPledges = tripPledges.filter(pledge => {
    if (filter === 'all') return true;
    return pledge.status === filter;
  });

  const totalPledges = tripPledges.reduce((sum, pledge) => sum + (pledge.amount || 0), 0);
  const confirmedPledges = tripPledges
    .filter(p => p.status === 'confirmed')
    .reduce((sum, pledge) => sum + (pledge.amount || 0), 0);
  const receivedPledges = tripPledges
    .filter(p => p.status === 'received')
    .reduce((sum, pledge) => sum + (pledge.amount || 0), 0);

  const handleEdit = (pledge) => {
    setEditingPledge(pledge);
    setModalOpen(true);
  };

  const handleDelete = (pledgeId) => {
    if (confirm('Are you sure you want to delete this pledge?')) {
      deletePledge(pledgeId);
      success('Pledge deleted successfully');
    }
  };

  const handleContact = (pledge, method) => {
    if (method === 'email') {
      success(`Opening email to ${pledge.donorName}`);
    } else if (method === 'phone') {
      success(`Calling ${pledge.donorName}`);
    }
  };

  const handleSave = (pledgeData) => {
    if (editingPledge) {
      updatePledge({ ...editingPledge, ...pledgeData });
      success('Pledge updated successfully');
    } else {
      addPledge(pledgeData);
      success('Pledge recorded successfully');
    }
    setEditingPledge(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPledge(null);
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiHeart} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to manage pledges.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Pledges & Donations</h1>
          <p className="text-gray-600">Track pledges for {currentTrip.name}</p>
        </div>
        <Button
          icon={FiPlus}
          onClick={() => setModalOpen(true)}
        >
          Record Pledge
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-full mb-3">
            <SafeIcon icon={FiTarget} className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Total Pledges</h3>
          <p className="text-2xl font-bold text-gray-900">${totalPledges.toLocaleString()}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-warning-100 rounded-full mb-3">
            <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-warning-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Confirmed</h3>
          <p className="text-2xl font-bold text-gray-900">${confirmedPledges.toLocaleString()}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-100 rounded-full mb-3">
            <SafeIcon icon={FiHeart} className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Received</h3>
          <p className="text-2xl font-bold text-gray-900">${receivedPledges.toLocaleString()}</p>
        </Card>
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
            <option value="all">All Pledges</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Pledges Grid */}
      {filteredPledges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPledges.map((pledge, index) => (
            <motion.div
              key={pledge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PledgeCard
                pledge={pledge}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onContact={handleContact}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <SafeIcon icon={FiHeart} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pledges Found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? 'Start recording pledges from your meetings.'
              : `No pledges with status "${filter}" found.`
            }
          </p>
          <Button
            icon={FiPlus}
            onClick={() => setModalOpen(true)}
          >
            Record Pledge
          </Button>
        </Card>
      )}

      <PledgeModal
        pledge={editingPledge}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </motion.div>
  );
}

export default Pledges;