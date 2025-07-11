import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import Card from '../components/common/Card';
import ProgressRing from '../components/common/ProgressRing';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBarChart3, FiCalendar, FiUsers, FiHeart } = FiIcons;

function MetricCard({ title, value, subtitle, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600'
  };

  return (
    <Card className="text-center">
      <div className={`flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-3 ${colorClasses[color]}`}>
        <SafeIcon icon={icon} className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </Card>
  );
}

function ProgressCard({ title, current, target, unit = '', color = '#0ea5e9' }) {
  const progress = target > 0 ? (current / target) * 100 : 0;
  
  return (
    <Card className="text-center">
      <ProgressRing 
        progress={progress} 
        size={80} 
        color={color}
      />
      <h3 className="text-lg font-semibold text-gray-900 mt-4">{title}</h3>
      <p className="text-gray-600">
        {current.toLocaleString()}{unit} of {target.toLocaleString()}{unit}
      </p>
    </Card>
  );
}

function Analytics() {
  const { currentTrip, tasks, meetings, pledges } = useTrip();

  const analytics = useMemo(() => {
    if (!currentTrip) return null;

    const tripTasks = tasks.filter(t => t.tripId === currentTrip.id);
    const tripMeetings = meetings.filter(m => m.tripId === currentTrip.id);
    const tripPledges = pledges.filter(p => p.tripId === currentTrip.id);

    // Task Analytics
    const totalTasks = tripTasks.length;
    const completedTasks = tripTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tripTasks.filter(t => 
      t.status !== 'completed' && new Date(t.dueDate) < new Date()
    ).length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Meeting Analytics
    const totalMeetings = tripMeetings.length;
    const completedMeetings = tripMeetings.filter(m => m.status === 'completed').length;
    const upcomingMeetings = tripMeetings.filter(m => 
      m.status === 'scheduled' && new Date(m.date) > new Date()
    ).length;

    // Pledge Analytics
    const totalPledges = tripPledges.reduce((sum, p) => sum + (p.amount || 0), 0);
    const confirmedPledges = tripPledges
      .filter(p => p.status === 'confirmed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const receivedPledges = tripPledges
      .filter(p => p.status === 'received')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Meeting type breakdown
    const meetingsByType = tripMeetings.reduce((acc, meeting) => {
      acc[meeting.type] = (acc[meeting.type] || 0) + 1;
      return acc;
    }, {});

    const pledgesByType = tripPledges.reduce((acc, pledge) => {
      acc[pledge.type] = (acc[pledge.type] || 0) + pledge.amount;
      return acc;
    }, {});

    return {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate: taskCompletionRate
      },
      meetings: {
        total: totalMeetings,
        completed: completedMeetings,
        upcoming: upcomingMeetings,
        byType: meetingsByType
      },
      pledges: {
        total: totalPledges,
        confirmed: confirmedPledges,
        received: receivedPledges,
        byType: pledgesByType
      }
    };
  }, [currentTrip, tasks, meetings, pledges]);

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiBarChart3} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to view analytics.</p>
        </Card>
      </motion.div>
    );
  }

  if (!analytics) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiBarChart3} className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-gray-600">Calculating trip metrics...</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trip Analytics</h1>
        <p className="text-gray-600">Performance metrics for {currentTrip.name}</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ProgressCard
          title="Task Completion"
          current={analytics.tasks.completed}
          target={analytics.tasks.total}
          color="#22c55e"
        />
        
        <MetricCard
          title="Total Meetings"
          value={analytics.meetings.total}
          subtitle={`${analytics.meetings.upcoming} upcoming`}
          icon={FiUsers}
          color="primary"
        />
        
        <MetricCard
          title="Total Pledges"
          value={`$${analytics.pledges.total.toLocaleString()}`}
          subtitle={`$${analytics.pledges.received.toLocaleString()} received`}
          icon={FiHeart}
          color="success"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Tasks"
          value={analytics.tasks.total}
          subtitle={`${analytics.tasks.overdue} overdue`}
          icon={FiCalendar}
          color={analytics.tasks.overdue > 0 ? 'danger' : 'primary'}
        />
        
        <MetricCard
          title="Completed Meetings"
          value={analytics.meetings.completed}
          subtitle={`${((analytics.meetings.completed / analytics.meetings.total) * 100 || 0).toFixed(0)}% completion rate`}
          icon={FiUsers}
          color="success"
        />
        
        <MetricCard
          title="Confirmed Pledges"
          value={`$${analytics.pledges.confirmed.toLocaleString()}`}
          subtitle={`${((analytics.pledges.confirmed / analytics.pledges.total) * 100 || 0).toFixed(0)}% of total`}
          icon={FiHeart}
          color="warning"
        />
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Type Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meetings by Type</h3>
          <div className="space-y-3">
            {Object.entries(analytics.meetings.byType).map(([type, count]) => {
              const percentage = analytics.meetings.total > 0 
                ? (count / analytics.meetings.total) * 100 
                : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{count} meeting{count !== 1 ? 's' : ''}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pledge Breakdown */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pledges by Type</h3>
          <div className="space-y-3">
            {Object.entries(analytics.pledges.byType).map(([type, amount]) => {
              const percentage = analytics.pledges.total > 0 
                ? (amount / analytics.pledges.total) * 100 
                : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">${amount.toLocaleString()}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-success-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Performance Highlights</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Task completion rate: {analytics.tasks.completionRate.toFixed(1)}%</li>
              <li>• Meeting completion rate: {analytics.meetings.total > 0 ? ((analytics.meetings.completed / analytics.meetings.total) * 100).toFixed(1) : 0}%</li>
              <li>• Total pledges collected: ${analytics.pledges.total.toLocaleString()}</li>
              <li>• Pledge confirmation rate: {analytics.pledges.total > 0 ? ((analytics.pledges.confirmed / analytics.pledges.total) * 100).toFixed(1) : 0}%</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Areas for Attention</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {analytics.tasks.overdue > 0 && (
                <li className="text-danger-600">• {analytics.tasks.overdue} overdue tasks need attention</li>
              )}
              {analytics.meetings.upcoming === 0 && (
                <li className="text-secondary-600">• No upcoming meetings scheduled</li>
              )}
              {analytics.pledges.confirmed < analytics.pledges.total && (
                <li className="text-warning-600">• ${(analytics.pledges.total - analytics.pledges.confirmed).toLocaleString()} in pledges pending confirmation</li>
              )}
              {analytics.tasks.completionRate < 50 && (
                <li className="text-warning-600">• Task completion rate below 50%</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default Analytics;