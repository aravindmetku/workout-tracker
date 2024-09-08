"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type WorkoutData = {
  id: string;
  name: string;
  date: Date;
  duration: number; // in minutes
  exercises: {
    name: string;
    sets: number;
    reps: number[];
  }[];
};

type WorkoutHistoryContextType = {
  workoutHistory: WorkoutData[];
  addWorkout: (workout: Omit<WorkoutData, 'id'>) => void;
  getWorkoutHistory: () => WorkoutData[];
};

const WorkoutHistoryContext = createContext<WorkoutHistoryContextType | undefined>(undefined);

export const WorkoutHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutData[]>([]);

  useEffect(() => {
    // Load workout history from local storage on initial render
    const storedHistory = localStorage.getItem('workoutHistory');
    if (storedHistory) {
      setWorkoutHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addWorkout = (workout: Omit<WorkoutData, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
    };
    const updatedHistory = [...workoutHistory, newWorkout];
    setWorkoutHistory(updatedHistory);
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
  };

  const getWorkoutHistory = () => workoutHistory;

  return (
    <WorkoutHistoryContext.Provider value={{ workoutHistory, addWorkout, getWorkoutHistory }}>
      {children}
    </WorkoutHistoryContext.Provider>
  );
};

export const useWorkoutHistory = () => {
  const context = useContext(WorkoutHistoryContext);
  if (context === undefined) {
    throw new Error('useWorkoutHistory must be used within a WorkoutHistoryProvider');
  }
  return context;
};