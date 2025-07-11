import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const TripContext = createContext();

const initialState = {
  currentTrip: null,
  trips: [],
  tasks: [],
  meetings: [],
  documents: [],
  expenses: [],
  pledges: [],
  communications: [],
  loading: false,
  error: null,
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload };
    case 'ADD_TRIP':
      const newTrip = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return {
        ...state,
        trips: [...state.trips, newTrip],
        currentTrip: newTrip
      };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip => 
          trip.id === action.payload.id ? { ...trip, ...action.payload } : trip
        ),
        currentTrip: state.currentTrip?.id === action.payload.id
          ? { ...state.currentTrip, ...action.payload }
          : state.currentTrip
      };
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload),
        currentTrip: state.currentTrip?.id === action.payload ? null : state.currentTrip
      };
    case 'ADD_TASK':
      const newTask = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return { ...state, tasks: [...state.tasks, newTask] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'ADD_MEETING':
      const newMeeting = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return { ...state, meetings: [...state.meetings, newMeeting] };
    case 'UPDATE_MEETING':
      return {
        ...state,
        meetings: state.meetings.map(meeting => 
          meeting.id === action.payload.id ? { ...meeting, ...action.payload } : meeting
        )
      };
    case 'DELETE_MEETING':
      return {
        ...state,
        meetings: state.meetings.filter(meeting => meeting.id !== action.payload)
      };
    case 'ADD_DOCUMENT':
      const newDocument = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return { ...state, documents: [...state.documents, newDocument] };
    case 'ADD_EXPENSE':
      const newExpense = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return { ...state, expenses: [...state.expenses, newExpense] };
    case 'ADD_PLEDGE':
      const newPledge = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return { ...state, pledges: [...state.pledges, newPledge] };
    case 'UPDATE_PLEDGE':
      return {
        ...state,
        pledges: state.pledges.map(pledge => 
          pledge.id === action.payload.id ? { ...pledge, ...action.payload } : pledge
        )
      };
    case 'DELETE_PLEDGE':
      return {
        ...state,
        pledges: state.pledges.filter(pledge => pledge.id !== action.payload)
      };
    case 'ADD_COMMUNICATION':
      const newCommunication = { ...action.payload, id: uuidv4(), createdAt: new Date() };
      return { ...state, communications: [...state.communications, newCommunication] };
    case 'LOAD_DATA':
      return { ...state, ...action.payload, loading: false };
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('amaniTripData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('amaniTripData', JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    dispatch,
    // Helper functions
    addTrip: (tripData) => dispatch({ type: 'ADD_TRIP', payload: tripData }),
    updateTrip: (tripData) => dispatch({ type: 'UPDATE_TRIP', payload: tripData }),
    deleteTrip: (tripId) => dispatch({ type: 'DELETE_TRIP', payload: tripId }),
    setCurrentTrip: (trip) => dispatch({ type: 'SET_CURRENT_TRIP', payload: trip }),
    addTask: (taskData) => dispatch({ type: 'ADD_TASK', payload: taskData }),
    updateTask: (taskData) => dispatch({ type: 'UPDATE_TASK', payload: taskData }),
    deleteTask: (taskId) => dispatch({ type: 'DELETE_TASK', payload: taskId }),
    addMeeting: (meetingData) => dispatch({ type: 'ADD_MEETING', payload: meetingData }),
    updateMeeting: (meetingData) => dispatch({ type: 'UPDATE_MEETING', payload: meetingData }),
    deleteMeeting: (meetingId) => dispatch({ type: 'DELETE_MEETING', payload: meetingId }),
    addDocument: (documentData) => dispatch({ type: 'ADD_DOCUMENT', payload: documentData }),
    addExpense: (expenseData) => dispatch({ type: 'ADD_EXPENSE', payload: expenseData }),
    addPledge: (pledgeData) => dispatch({ type: 'ADD_PLEDGE', payload: pledgeData }),
    updatePledge: (pledgeData) => dispatch({ type: 'UPDATE_PLEDGE', payload: pledgeData }),
    deletePledge: (pledgeId) => dispatch({ type: 'DELETE_PLEDGE', payload: pledgeId }),
    addCommunication: (commData) => dispatch({ type: 'ADD_COMMUNICATION', payload: commData }),
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}