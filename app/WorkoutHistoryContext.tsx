"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const addWorkout = (workout: Omit<WorkoutData, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(), // Simple ID generation
    };
    setWorkoutHistory(prevHistory => [...prevHistory, newWorkout]);
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