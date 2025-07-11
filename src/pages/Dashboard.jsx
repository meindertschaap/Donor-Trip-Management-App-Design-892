import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressRing from '../components/common/ProgressRing';
import StatusBadge from '../components/common/StatusBadge';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCalendar, FiCheckSquare, FiUsers, FiHeart, FiTrendingUp, FiAlertTriangle, FiClock } = FiIcons;

function Dashboard() {
  const navigate = useNavigate();
  const { currentTrip, tasks, meetings, pledges } = useTrip();

  // Calculate metrics
  const totalTasks = tasks.filter(t => t.tripId === currentTrip?.id).length;
  const completedTasks = tasks.filter(t => t.tripId === currentTrip?.id && t.status === 'completed').length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const upcomingMeetings = meetings.filter(m => 
    m.tripId === currentTrip?.id && new Date(m.date) > new Date()
  ).length;

  const totalPledges = pledges
    .filter(p => p.tripId === currentTrip?.id)
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const confirmedPledges = pledges
    .filter(p => p.tripId === currentTrip?.id && p.status === 'confirmed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const overdueTasks = tasks.filter(t => 
    t.tripId === currentTrip?.id && 
    t.status !== 'completed' && 
    new Date(t.dueDate) < new Date()
  );

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

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12">
            <SafeIcon icon={FiCalendar} className="mx-auto h-16 w-16 text-amani-orange-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Amani Trip Command Center
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get started by creating your first trip. The Command Center will help you manage every aspect of your donor trip from planning to execution and follow-up.
            </p>
            <Button
              icon={FiPlus}
              onClick={() => navigate('/setup')}
              size="lg"
            >
              Create Your First Trip
            </Button>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Dashboard</h1>
          <p className="text-gray-600">Overview of {currentTrip.name}</p>
          {currentTrip.destinations && (
            <p className="text-sm text-gray-500 mt-1">
              {formatDestinations(currentTrip.destinations)} • {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
            </p>
          )}
        </div>
        <Button
          icon={FiPlus}
          onClick={() => navigate('/setup')}
          variant="outline"
        >
          New Trip
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <ProgressRing progress={taskProgress} size={80} />
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Task Progress</h3>
          <p className="text-gray-600">{completedTasks} of {totalTasks} completed</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-amani-blue-100 to-amani-blue-200 rounded-full mb-4">
            <SafeIcon icon={FiUsers} className="h-8 w-8 text-amani-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Meetings</h3>
          <p className="text-gray-600">{upcomingMeetings} upcoming</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-accent-100 to-accent-200 rounded-full mb-4">
            <SafeIcon icon={FiHeart} className="h-8 w-8 text-accent-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Pledges</h3>
          <p className="text-gray-600">${totalPledges.toLocaleString()}</p>
          <p className="text-sm text-accent-600">${confirmedPledges.toLocaleString()} confirmed</p>
        </Card>
      </div>

      {/* Action Items & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/tasks')}
            >
              View All
            </Button>
          </div>
          {overdueTasks.length > 0 && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
              <div className="flex items-center">
                <SafeIcon icon={FiAlertTriangle} className="h-5 w-5 text-danger-600 mr-2" />
                <span className="text-sm font-medium text-danger-800">
                  {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {tasks
              .filter(t => t.tripId === currentTrip?.id && t.status !== 'completed')
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-amani-orange-50 to-amani-blue-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center mt-1 space-x-2">
                      <SafeIcon icon={FiClock} className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            {tasks.filter(t => t.tripId === currentTrip?.id && t.status !== 'completed').length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending tasks</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              icon={FiCheckSquare}
              onClick={() => navigate('/tasks')}
            >
              Add Task
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              icon={FiUsers}
              onClick={() => navigate('/meetings')}
            >
              Schedule Meeting
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              icon={FiHeart}
              onClick={() => navigate('/pledges')}
            >
              Record Pledge
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              icon={FiTrendingUp}
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </div>
        </Card>
      </div>

      {/* Timeline Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Milestones</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/timeline')}
          >
            View Timeline
          </Button>
        </div>
        <div className="space-y-3">
          {meetings
            .filter(m => m.tripId === currentTrip?.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3)
            .map((meeting) => (
              <div key={meeting.id} className="flex items-center p-3 bg-gradient-to-r from-amani-orange-50 to-amani-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amani-blue-100 to-amani-blue-200 rounded-lg flex items-center justify-center mr-3">
                  <SafeIcon icon={FiUsers} className="h-6 w-6 text-amani-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{meeting.title}</h4>
                  <p className="text-xs text-gray-500">{meeting.location} • {formatDate(meeting.date)}</p>
                </div>
                <StatusBadge status={meeting.status} size="sm" />
              </div>
            ))}
          {meetings.filter(m => m.tripId === currentTrip?.id).length === 0 && (
            <p className="text-gray-500 text-center py-4">No meetings scheduled</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default Dashboard;