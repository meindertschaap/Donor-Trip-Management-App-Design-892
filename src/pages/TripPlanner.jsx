import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrip } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiCheck, FiChevronDown, FiChevronRight, FiPlus, FiEdit3, FiTrash2 } = FiIcons;

// Master checklist periods and tasks with smart grouping
const masterChecklist = [
  {
    id: 'period-1',
    title: '4 – 6 Months Before Travel – Foundation & Approvals',
    tasks: [
      { id: 'task-1-1', title: 'Decide which countries to visit', category: 'destination-planning' },
      { id: 'task-1-2', title: 'Decide which key cities/places to visit in each country', category: 'destination-planning' },
      { id: 'task-1-3', title: 'Decide the approximate travel period (often linked to events)', category: 'destination-planning' },
      { id: 'task-1-4', title: 'Decide on the fundraising targets for each country and each event', category: 'fundraising-strategy' },
      { id: 'task-1-5', title: 'List all events and key people to meet, per location', category: 'fundraising-strategy' },
      { id: 'task-1-6', title: 'Finalise (or secure holds on) event dates and venues', category: 'fundraising-strategy' },
      { id: 'task-1-7', title: 'Draft the high-level itinerary / travel plan', category: 'destination-planning' },
      { id: 'task-1-8', title: 'Plan which stories, photos, videos you will need', category: 'content-planning' },
      { id: 'task-1-9', title: 'Plan the full list of data / statistics you will need', category: 'content-planning' },
      { id: 'task-1-10', title: 'Obtain letters of invitation for visa applications', category: 'documentation' },
      { id: 'task-1-11', title: 'Arrange visas / visa waivers (including any transit visas)', category: 'documentation' },
      { id: 'task-1-12', title: 'Check passport validity and any medical requirements', category: 'documentation' },
      { id: 'task-1-13', title: 'Choose / set up a robust system to track pledges and interests', category: 'content-planning' }
    ]
  },
  {
    id: 'period-2',
    title: '2 – 3 Months Before Travel – Bookings & First Outreach',
    tasks: [
      { id: 'task-2-1', title: 'Help ensure optimal numbers of event participants (early invitations & promotion)', category: 'event-coordination' },
      { id: 'task-2-2', title: 'Reach out to every key person/group and place meetings on their calendars', category: 'outreach-scheduling' },
      { id: 'task-2-3', title: 'Build the draft meetings / events schedule', category: 'outreach-scheduling' },
      { id: 'task-2-4', title: 'Book flights, trains and other transport', category: 'travel-bookings' },
      { id: 'task-2-5', title: 'Decide where to stay in each location and confirm lodging with supporters where possible', category: 'travel-bookings' },
      { id: 'task-2-6', title: 'Book hotels / Airbnbs where needed', category: 'travel-bookings' },
      { id: 'task-2-7', title: 'Begin the master list of event materials (presentations, statistics, hand-outs, one-pagers, posters, pledge sheets, QR codes)', category: 'event-coordination' },
      { id: 'task-2-8', title: 'For every planned meeting, write the desired outcomes and work backwards on preparations', category: 'outreach-scheduling' },
      { id: 'task-2-9', title: 'Open a file to keep track of expenses from this point forward', category: 'administrative' },
      { id: 'task-2-10', title: 'Arrange or confirm travel / medical insurance', category: 'administrative' },
      { id: 'task-2-11', title: 'Continue visa follow-up until all approvals are received', category: 'administrative' },
      { id: 'task-2-12', title: 'Keep a running list of gift items required for events and personal visits', category: 'event-coordination' },
      { id: 'task-2-13', title: 'Work with partners on the initial run-of-show for each event', category: 'event-coordination' },
      { id: 'task-2-14', title: 'Implement the pledge-tracking system inside Little Green Light (or equivalent)', category: 'administrative' }
    ]
  },
  {
    id: 'period-3',
    title: '1 Month Before Travel – Content & Confirmation',
    tasks: [
      { id: 'task-3-1', title: 'Confirm lodging with hosts; finalise any remaining hotel bookings', category: 'travel-confirmation' },
      { id: 'task-3-2', title: 'Finalize the itinerary (travel legs, meetings and events)', category: 'travel-confirmation' },
      { id: 'task-3-3', title: 'Build and refine presentations; integrate high-impact child/youth stories with fitted photos and videos', category: 'content-creation' },
      { id: 'task-3-4', title: 'Gather all relevant statistics (child data) for meetings and slides', category: 'content-creation' },
      { id: 'task-3-5', title: 'Assemble comprehensive talking points (programmes, new developments, needs, successes, financials, impact, collaborations, strategy)', category: 'content-creation' },
      { id: 'task-3-6', title: 'Draft and polish concise soundbites / elevator pitch', category: 'content-creation' },
      { id: 'task-3-7', title: 'Decide on detailed agendas for all official meetings (e.g., FOA boards)', category: 'meeting-preparation' },
      { id: 'task-3-8', title: 'Create or finalise pledge sheets with sponsorship tiers', category: 'fundraising-materials' },
      { id: 'task-3-9', title: 'Create and embed QR codes linking to donation pages and background materials', category: 'fundraising-materials' },
      { id: 'task-3-10', title: 'Confirm that child videos align with each audience; line up any auction items and the auctioneer', category: 'fundraising-materials' },
      { id: 'task-3-11', title: 'Finalise fundraising options/needs lists (varied programme elements and gift amounts)', category: 'fundraising-materials' },
      { id: 'task-3-12', title: 'Purchase approved gift items, including special Tanzanian donor gifties', category: 'meeting-preparation' },
      { id: 'task-3-13', title: 'Ensure credit cards work internationally and raise limits if required', category: 'travel-confirmation' }
    ]
  },
  {
    id: 'period-4',
    title: '2 Weeks Before Travel – Materials & Reminders',
    tasks: [
      { id: 'task-4-1', title: 'Practise, practise, practise: event presentations, narratives and child stories', category: 'presentation-prep' },
      { id: 'task-4-2', title: 'Practise key talking points', category: 'presentation-prep' },
      { id: 'task-4-3', title: 'Send updates pack & agendas for FOA board meetings (≥ 10 days in advance)', category: 'communications' },
      { id: 'task-4-4', title: 'Send calendar reminders / save-the-date nudges to all meeting contacts', category: 'communications' },
      { id: 'task-4-5', title: 'Print and organise all materials: annual reports, impact stats sheets, brochures (≥ 200), business cards, pledge sheets, agendas', category: 'materials-prep' },
      { id: 'task-4-6', title: 'Prepare hand-outs, one-pagers, posters and the background loop video/photo slideshow', category: 'materials-prep' },
      { id: 'task-4-7', title: 'Ensure optimal A/V is booked or tested (including good sound)', category: 'technical-setup' },
      { id: 'task-4-8', title: 'Confirm auction items are in hand and auctioneer briefed', category: 'technical-setup' },
      { id: 'task-4-9', title: 'Confirm volunteers who will manage on-the-spot donations (Square, mobile pay, cheques)', category: 'technical-setup' },
      { id: 'task-4-10', title: 'Finalise run-of-show documents and share with partners', category: 'materials-prep' },
      { id: 'task-4-11', title: 'Re-check travel / medical insurance documentation', category: 'documentation-check' },
      { id: 'task-4-12', title: 'Re-check visa / ESTA / eTA approvals and print copies', category: 'documentation-check' }
    ]
  },
  {
    id: 'period-5',
    title: 'Week Before Travel – Packing & Last Touches',
    tasks: [
      { id: 'task-5-1', title: 'Pack according to weather at all destinations, including spare HDMI cable, universal electrical plugs, Bluetooth presentation clicker, ≥ 200 brochures, business cards, printed materials, gift items' },
      { id: 'task-5-2', title: 'Have small amounts of cash in required currencies' },
      { id: 'task-5-3', title: 'Download offline city maps for each stop' },
      { id: 'task-5-4', title: 'Arrange local phone / internet data plans or e-SIMs' },
      { id: 'task-5-5', title: 'Reconfirm flights, trains, ground transport and accommodation check-in details' },
      { id: 'task-5-6', title: 'Send personal touch-point emails to key people as a final reminder' },
      { id: 'task-5-7', title: 'Double-check presentations, videos, pledge sheets, QR codes are on laptop and cloud' },
      { id: 'task-5-8', title: 'Increase credit-card limit if still pending' },
      { id: 'task-5-9', title: 'Conduct a final personal prep for each meeting: outcomes and approach' }
    ]
  },
  {
    id: 'period-6',
    title: 'During the Trip – Daily Discipline',
    tasks: [
      { id: 'task-6-1', title: 'Daily check-ins & self-evaluations; adjust the plan as needed', category: 'daily-management' },
      { id: 'task-6-2', title: 'Before each meeting: refresh goals and talking points; ensure gift items and business cards are ready', category: 'meeting-execution' },
      { id: 'task-6-3', title: 'Run events following the approved run-of-show; ensure A/V works and the background loop is playing', category: 'event-execution' },
      { id: 'task-6-4', title: 'Use pledge sheets and QR codes; enable on-the-spot donations (Square, mobile, cheque) with volunteers', category: 'fundraising-execution' },
      { id: 'task-6-5', title: 'Record donations and pledges immediately; update Little Green Light', category: 'fundraising-execution' },
      { id: 'task-6-6', title: 'Take detailed notes after every meeting (learnings, follow-ups, opportunities)', category: 'meeting-execution' },
      { id: 'task-6-7', title: 'Keep track of expenses daily (scan receipts)', category: 'daily-management' },
      { id: 'task-6-8', title: 'Maintain daily updates of outcomes and pledges in the CRM', category: 'fundraising-execution' },
      { id: 'task-6-9', title: 'Continue to distribute brochures, annual reports and visiting cards as appropriate', category: 'event-execution' }
    ]
  },
  {
    id: 'period-7',
    title: 'Within 2 Weeks After Each Meeting / Event',
    tasks: [
      { id: 'task-7-1', title: 'Send personalised thank-you emails within 4 days of every meeting' },
      { id: 'task-7-2', title: 'Record donations and issue timely thank-yous' },
      { id: 'task-7-3', title: 'Enter new donors or prospects into the follow-up pipeline' },
      { id: 'task-7-4', title: 'Update pledges and outcomes in Little Green Light' },
      { id: 'task-7-5', title: 'Submit expense items for reconciliation / reimbursement' },
      { id: 'task-7-6', title: 'Conduct an internal debrief on what worked well and what could improve' }
    ]
  },
  {
    id: 'period-8',
    title: 'Within 1 Month After the Trip',
    tasks: [
      { id: 'task-8-1', title: 'Publish a detailed Trip Report to the Amani-TZ Board and Management Team' },
      { id: 'task-8-2', title: 'Submit the full expense report and obtain reimbursements' },
      { id: 'task-8-3', title: 'Finalize donation totals from each event (goal: within 6 weeks)' },
      { id: 'task-8-4', title: 'Ensure pledge follow-up plans are in motion' }
    ]
  },
  {
    id: 'period-9',
    title: 'Within 2 Months After the Trip',
    tasks: [
      { id: 'task-9-1', title: 'Feed lessons learned into the next trip cycle' },
      { id: 'task-9-2', title: 'Continue pledge follow-through until every commitment is honoured' },
      { id: 'task-9-3', title: 'Verify the pledge-tracking system captured every interest accurately and update as required' }
    ]
  }
];

// Category mapping for smart grouping
const categoryLabels = {
  'destination-planning': 'Destination Planning',
  'fundraising-strategy': 'Fundraising Strategy',
  'content-planning': 'Content Planning',
  'documentation': 'Documentation',
  'event-coordination': 'Event Coordination',
  'outreach-scheduling': 'Outreach & Scheduling',
  'travel-bookings': 'Travel Bookings',
  'administrative': 'Administrative',
  'travel-confirmation': 'Travel Confirmation',
  'content-creation': 'Content Creation',
  'meeting-preparation': 'Meeting Preparation',
  'fundraising-materials': 'Fundraising Materials',
  'presentation-prep': 'Presentation Preparation',
  'communications': 'Communications',
  'materials-prep': 'Materials Preparation',
  'technical-setup': 'Technical Setup',
  'documentation-check': 'Documentation Check',
  'daily-management': 'Daily Management',
  'meeting-execution': 'Meeting Execution',
  'event-execution': 'Event Execution',
  'fundraising-execution': 'Fundraising Execution'
};

function PeriodProgressBar({ completedTasks, totalTasks }) {
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className="w-full h-2 bg-amani-orange-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-amani-orange-500 to-amani-orange-600 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

function TaskSubGroup({ category, tasks, periodId, onToggleTask, onEditTask, onDeleteTask, expandedSubGroups, onToggleSubGroup }) {
  const categoryName = categoryLabels[category] || category;
  const isExpanded = expandedSubGroups[`${periodId}-${category}`];
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="ml-4 mb-4 border-l-2 border-amani-orange-200 pl-4">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2 p-2 rounded-lg bg-gradient-to-r from-amani-orange-25 to-amani-blue-25 hover:from-amani-orange-50 hover:to-amani-blue-50 transition-colors"
        onClick={() => onToggleSubGroup(`${periodId}-${category}`)}
      >
        <div className="flex items-center">
          <SafeIcon
            icon={isExpanded ? FiChevronDown : FiChevronRight}
            className="h-4 w-4 text-amani-orange-500 mr-2 transition-transform duration-200"
          />
          <h5 className="text-sm font-semibold text-gray-800">{categoryName}</h5>
          <span className="ml-2 text-xs text-gray-500">
            ({completedCount}/{totalCount})
          </span>
        </div>
        <div className="w-16 h-1.5 bg-amani-orange-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amani-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              periodId={periodId}
              onToggleTask={onToggleTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function TaskItem({ task, periodId, onToggleTask, onEditTask, onDeleteTask, editTaskId, editTaskTitle, onSaveEdit }) {
  return (
    <li className="flex items-start group">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border mt-0.5 mr-3 flex items-center justify-center cursor-pointer transition-colors ${
          task.completed
            ? 'bg-amani-orange-500 border-amani-orange-500'
            : 'border-amani-orange-300 hover:border-amani-orange-400'
        }`}
        onClick={() => onToggleTask(periodId, task.id)}
      >
        {task.completed && <SafeIcon icon={FiCheck} className="h-3 w-3 text-white" />}
      </div>
      <div className="flex-1">
        {editTaskId === task.id ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editTaskTitle}
              onChange={(e) => onSaveEdit(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-amani-orange-300 rounded focus:ring-2 focus:ring-amani-orange-500 focus:border-amani-orange-500"
              autoFocus
              onBlur={() => onSaveEdit()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSaveEdit();
                } else if (e.key === 'Escape') {
                  onSaveEdit(null);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {task.title}
            </span>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button
                onClick={() => onEditTask(periodId, task.id, task.title)}
                className="text-gray-400 hover:text-amani-orange-600 p-1"
              >
                <SafeIcon icon={FiEdit3} className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDeleteTask(periodId, task.id)}
                className="text-gray-400 hover:text-red-600 p-1"
              >
                <SafeIcon icon={FiTrash2} className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

function AddTaskModal({ isOpen, onClose, onSave, periodId, periodTitle }) {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onSave(periodId, taskTitle.trim());
      setTaskTitle('');
      onClose();
    }
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
          Add Task to "{periodTitle}"
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border border-amani-orange-300 rounded-lg focus:ring-2 focus:ring-amani-orange-500 focus:border-amani-orange-500"
              placeholder="Enter task description"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!taskTitle.trim()}>
              Add Task
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function TripPlanner() {
  const { currentTrip } = useTrip();
  const { success } = useNotification();
  const [tripTasks, setTripTasks] = useState(() => {
    // Load from localStorage or use the master checklist as default
    const savedTasks = localStorage.getItem('amaniTripTasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error('Error loading saved tasks:', e);
      }
    }
    return masterChecklist.map(period => ({
      ...period,
      expanded: period.id === 'period-1', // Expand first period by default
      tasks: period.tasks.map(task => ({ ...task, completed: false }))
    }));
  });

  const [expandedPeriods, setExpandedPeriods] = useState(() => {
    return tripTasks.reduce((acc, period) => {
      acc[period.id] = period.expanded || false;
      return acc;
    }, {});
  });

  const [expandedSubGroups, setExpandedSubGroups] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('amaniTripTasks', JSON.stringify(tripTasks));
  }, [tripTasks]);

  const togglePeriod = (periodId) => {
    setExpandedPeriods(prev => ({
      ...prev,
      [periodId]: !prev[periodId]
    }));
  };

  const toggleSubGroup = (subGroupId) => {
    setExpandedSubGroups(prev => ({
      ...prev,
      [subGroupId]: !prev[subGroupId]
    }));
  };

  const toggleTaskCompletion = (periodId, taskId) => {
    setTripTasks(prevTasks =>
      prevTasks.map(period =>
        period.id === periodId
          ? {
              ...period,
              tasks: period.tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : period
      )
    );
    success('Task status updated');
  };

  const addTask = (periodId, taskTitle) => {
    setTripTasks(prevTasks =>
      prevTasks.map(period =>
        period.id === periodId
          ? {
              ...period,
              tasks: [
                ...period.tasks,
                {
                  id: `custom-${Date.now()}`,
                  title: taskTitle,
                  completed: false,
                  custom: true
                }
              ]
            }
          : period
      )
    );
    success('New task added');
  };

  const startEditTask = (periodId, taskId, taskTitle) => {
    setCurrentPeriod(periodId);
    setEditTaskId(taskId);
    setEditTaskTitle(taskTitle);
  };

  const saveEditedTask = (newTitle = null) => {
    if (newTitle !== null) {
      setEditTaskTitle(newTitle);
      return;
    }

    if (!editTaskTitle.trim()) {
      setEditTaskId(null);
      setEditTaskTitle('');
      return;
    }

    setTripTasks(prevTasks =>
      prevTasks.map(period =>
        period.id === currentPeriod
          ? {
              ...period,
              tasks: period.tasks.map(task =>
                task.id === editTaskId
                  ? { ...task, title: editTaskTitle }
                  : task
              )
            }
          : period
      )
    );
    setEditTaskId(null);
    setEditTaskTitle('');
    success('Task updated');
  };

  const deleteTask = (periodId, taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTripTasks(prevTasks =>
        prevTasks.map(period =>
          period.id === periodId
            ? {
                ...period,
                tasks: period.tasks.filter(task => task.id !== taskId)
              }
            : period
        )
      );
      success('Task deleted');
    }
  };

  const resetAllTasks = () => {
    if (confirm('Are you sure you want to reset all tasks to their default state? This will mark all tasks as incomplete.')) {
      setTripTasks(masterChecklist.map(period => ({
        ...period,
        expanded: period.id === 'period-1',
        tasks: period.tasks.map(task => ({ ...task, completed: false }))
      })));
      success('All tasks have been reset');
    }
  };

  const openAddTaskModal = (periodId) => {
    const period = tripTasks.find(p => p.id === periodId);
    if (period) {
      setCurrentPeriod(periodId);
      setModalOpen(true);
    }
  };

  // Smart grouping function
  const groupTasks = (tasks) => {
    if (tasks.length <= 5) {
      return { ungrouped: tasks };
    }

    const grouped = {};
    const ungrouped = [];

    tasks.forEach(task => {
      if (task.category) {
        if (!grouped[task.category]) {
          grouped[task.category] = [];
        }
        grouped[task.category].push(task);
      } else {
        ungrouped.push(task);
      }
    });

    // Ensure each group has at least 3 tasks, otherwise merge with ungrouped
    const validGroups = {};
    Object.keys(grouped).forEach(category => {
      if (grouped[category].length >= 3) {
        validGroups[category] = grouped[category];
      } else {
        ungrouped.push(...grouped[category]);
      }
    });

    if (ungrouped.length > 0) {
      validGroups.ungrouped = ungrouped;
    }

    return validGroups;
  };

  if (!currentTrip) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <Card className="text-center py-12">
          <SafeIcon icon={FiCalendar} className="mx-auto h-16 w-16 text-amani-orange-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600">Please select or create a trip to use the Trip Planner.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Trip Planner</h1>
          <p className="text-gray-600">Master checklist for {currentTrip.name}</p>
        </div>
        <Button
          variant="outline"
          onClick={resetAllTasks}
        >
          Reset All Tasks
        </Button>
      </div>

      <div className="space-y-6">
        {tripTasks.map((period) => {
          const completedCount = period.tasks.filter(task => task.completed).length;
          const totalCount = period.tasks.length;
          const isExpanded = expandedPeriods[period.id];
          const groupedTasks = groupTasks(period.tasks);

          return (
            <Card key={period.id} className="transition-all duration-300">
              <div
                className="flex items-center justify-between cursor-pointer p-1"
                onClick={() => togglePeriod(period.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <SafeIcon
                      icon={isExpanded ? FiChevronDown : FiChevronRight}
                      className="h-5 w-5 text-gray-500 mr-2 transition-transform duration-200"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">{period.title}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="mr-2">
                      {completedCount} of {totalCount} tasks completed
                    </span>
                    <span className="text-sm font-medium text-amani-orange-600">
                      {Math.round((completedCount / totalCount) * 100)}%
                    </span>
                  </div>
                  <PeriodProgressBar
                    completedTasks={completedCount}
                    totalTasks={totalCount}
                  />
                </div>
              </div>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 border-t border-amani-orange-100 pt-4"
                >
                  {Object.keys(groupedTasks).length > 1 ? (
                    // Show grouped tasks
                    <div className="space-y-4">
                      {Object.entries(groupedTasks).map(([category, tasks]) => (
                        <TaskSubGroup
                          key={category}
                          category={category}
                          tasks={tasks}
                          periodId={period.id}
                          onToggleTask={toggleTaskCompletion}
                          onEditTask={startEditTask}
                          onDeleteTask={deleteTask}
                          expandedSubGroups={expandedSubGroups}
                          onToggleSubGroup={toggleSubGroup}
                        />
                      ))}
                    </div>
                  ) : (
                    // Show ungrouped tasks (5 or fewer tasks)
                    <ul className="space-y-2">
                      {period.tasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          periodId={period.id}
                          onToggleTask={toggleTaskCompletion}
                          onEditTask={startEditTask}
                          onDeleteTask={deleteTask}
                          editTaskId={editTaskId}
                          editTaskTitle={editTaskTitle}
                          onSaveEdit={saveEditedTask}
                        />
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 pt-3 border-t border-amani-orange-100">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={FiPlus}
                      onClick={() => openAddTaskModal(period.id)}
                    >
                      Add Custom Task
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addTask}
        periodId={currentPeriod}
        periodTitle={tripTasks.find(p => p.id === currentPeriod)?.title || ''}
      />
    </motion.div>
  );
}

export default TripPlanner;