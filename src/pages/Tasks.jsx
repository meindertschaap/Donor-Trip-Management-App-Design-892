import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCalendar, FiUser, FiEdit3, FiTrash2, FiClock } = FiIcons;

const TASK_STATUSES = [
  { id: 'not-started', title: 'Not Started', color: 'bg-gray-100' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-warning-100' },
  { id: 'completed', title: 'Completed', color: 'bg-success-100' }
];

function TaskCard({ task, onEdit, onDelete }) {
  const { updateTask } = useTrip();
  
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-4 rounded-lg shadow-soft border cursor-move ${
        isDragging ? 'opacity-50' : ''
      } ${isOverdue ? 'border-l-4 border-l-danger-500' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <SafeIcon icon={FiEdit3} className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiCalendar} className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
          {isOverdue && (
            <span className="text-danger-600 font-medium">Overdue</span>
          )}
        </div>

        {task.assignee && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <SafeIcon icon={FiUser} className="h-3 w-3" />
            <span>{task.assignee}</span>
          </div>
        )}

        {task.category && (
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {task.category}
            </span>
            <StatusBadge status={task.status} size="sm" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TaskColumn({ status, tasks, onEdit, onDelete }) {
  const { updateTask } = useTrip();
  const { success } = useNotification();

  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.status !== status.id) {
        updateTask({ id: item.id, status: status.id });
        success(`Task moved to ${status.title}`);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const columnTasks = tasks.filter(task => task.status === status.id);

  return (
    <div
      ref={drop}
      className={`flex-1 min-h-[500px] ${status.color} rounded-lg p-4 ${
        isOver ? 'ring-2 ring-primary-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{status.title}</h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
          {columnTasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {columnTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function TaskModal({ task, isOpen, onClose, onSave }) {
  const { currentTrip } = useTrip();
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      category: '',
      priority: 'medium',
      status: 'not-started'
    }
  );

  React.useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      tripId: currentTrip?.id,
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
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Team member name"
              />
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
                <option value="">Select category</option>
                <option value="Documentation">Documentation</option>
                <option value="Travel">Travel</option>
                <option value="Events">Events</option>
                <option value="Communications">Communications</option>
                <option value="Fundraising">Fundraising</option>
                <option value="Reporting">Reporting</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Tasks() {
  const { currentTrip, tasks, addTask, updateTask, deleteTask } = useTrip();
  const { success } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const tripTasks = tasks.filter(task => task.tripId === currentTrip?.id);

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      success('Task deleted successfully');
    }
  };

  const handleSave = (taskData) => {
    if (editingTask) {
      updateTask({ ...editingTask, ...taskData });
      success('Task updated successfully');
    } else {
      addTask(taskData);
      success('Task added successfully');
    }
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiClock} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to manage tasks.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage tasks for {currentTrip.name}</p>
        </div>
        <Button
          icon={FiPlus}
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto">
        {TASK_STATUSES.map(status => (
          <TaskColumn
            key={status.id}
            status={status}
            tasks={tripTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </motion.div>
  );
}

export default Tasks;