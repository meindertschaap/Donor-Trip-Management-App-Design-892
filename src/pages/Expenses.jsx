import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiDollarSign, FiReceipt, FiTrendingUp, FiDownload, FiEdit3, FiTrash2 } = FiIcons;

function ExpenseCard({ expense, onEdit, onDelete }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Travel': return FiIcons.FiMapPin;
      case 'Accommodation': return FiIcons.FiHome;
      case 'Meals': return FiIcons.FiCoffee;
      case 'Transportation': return FiIcons.FiTruck;
      case 'Events': return FiIcons.FiCalendar;
      case 'Materials': return FiIcons.FiPackage;
      default: return FiReceipt;
    }
  };

  return (
    <Card className="hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
            <SafeIcon 
              icon={getCategoryIcon(expense.category)} 
              className="h-5 w-5 text-warning-600" 
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {expense.description}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">
                ${expense.amount?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-gray-500">
                {expense.currency || 'USD'}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{new Date(expense.date).toLocaleDateString()}</span>
              <span>{expense.vendor}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <SafeIcon icon={FiEdit3} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {expense.category}
          </span>
          <div className="flex items-center space-x-2">
            {expense.receipt && (
              <SafeIcon icon={FiReceipt} className="h-4 w-4 text-success-600" />
            )}
            <StatusBadge status={expense.status} size="sm" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ExpenseModal({ expense, isOpen, onClose, onSave }) {
  const { currentTrip } = useTrip();
  const [formData, setFormData] = useState(
    expense || {
      description: '',
      amount: '',
      currency: 'USD',
      category: 'Travel',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      receipt: null,
      status: 'pending',
      notes: ''
    }
  );

  React.useEffect(() => {
    if (expense) {
      setFormData(expense);
    }
  }, [expense]);

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

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to cloud storage
      setFormData(prev => ({
        ...prev,
        receipt: {
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        }
      }));
    }
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
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Flight tickets to Nairobi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="KES">KES</option>
                <option value="UGX">UGX</option>
                <option value="TZS">TZS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Travel">Travel</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Meals">Meals</option>
                <option value="Transportation">Transportation</option>
                <option value="Events">Events</option>
                <option value="Materials">Materials</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Vendor/Supplier
              </label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Kenya Airways"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receipt
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleReceiptUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {formData.receipt && (
              <p className="text-sm text-gray-600 mt-1">
                Current receipt: {formData.receipt.name}
              </p>
            )}
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
              <option value="approved">Approved</option>
              <option value="reimbursed">Reimbursed</option>
              <option value="rejected">Rejected</option>
            </select>
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
              placeholder="Additional notes about this expense"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {expense ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Expenses() {
  const { currentTrip, expenses, addExpense } = useTrip();
  const { success } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filter, setFilter] = useState('all');

  const tripExpenses = expenses.filter(expense => expense.tripId === currentTrip?.id);

  const filteredExpenses = tripExpenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const totalExpenses = tripExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const approvedExpenses = tripExpenses
    .filter(e => e.status === 'approved')
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const pendingExpenses = tripExpenses
    .filter(e => e.status === 'pending')
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDelete = (expenseId) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      success('Expense deleted successfully');
    }
  };

  const handleSave = (expenseData) => {
    if (editingExpense) {
      success('Expense updated successfully');
    } else {
      addExpense(expenseData);
      success('Expense added successfully');
    }
    setEditingExpense(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  const handleExport = () => {
    success('Expense report exported successfully');
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiDollarSign} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to manage expenses.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track expenses for {currentTrip.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={FiDownload}
            onClick={handleExport}
          >
            Export Report
          </Button>
          <Button
            icon={FiPlus}
            onClick={() => setModalOpen(true)}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-warning-100 rounded-full mb-3">
            <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-warning-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success-100 rounded-full mb-3">
            <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Approved</h3>
          <p className="text-2xl font-bold text-gray-900">${approvedExpenses.toLocaleString()}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-secondary-100 rounded-full mb-3">
            <SafeIcon icon={FiReceipt} className="h-6 w-6 text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          <p className="text-2xl font-bold text-gray-900">${pendingExpenses.toLocaleString()}</p>
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
            <option value="all">All Expenses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="reimbursed">Reimbursed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Expenses Grid */}
      {filteredExpenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ExpenseCard
                expense={expense}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <SafeIcon icon={FiReceipt} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expenses Found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Start tracking expenses for your trip.'
              : `No expenses with status "${filter}" found.`
            }
          </p>
          <Button
            icon={FiPlus}
            onClick={() => setModalOpen(true)}
          >
            Add Expense
          </Button>
        </Card>
      )}

      <ExpenseModal
        expense={editingExpense}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </motion.div>
  );
}

export default Expenses;