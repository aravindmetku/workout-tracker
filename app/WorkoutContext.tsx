"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type WorkoutContextType = {
  workoutStart: Date | null;
  workoutEnd: Date | null;
  workoutCount: number;
  startWorkout: () => void;
  endWorkout: () => void;
  incrementWorkoutCount: () => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutStart, setWorkoutStart] = useState<Date | null>(null);
  const [workoutEnd, setWorkoutEnd] = useState<Date | null>(null);
  const [workoutCount, setWorkoutCount] = useState(0);

  const startWorkout = () => setWorkoutStart(new Date());
  const endWorkout = () => setWorkoutEnd(new Date());
  const incrementWorkoutCount = () => setWorkoutCount(prev => prev + 1);

  return (
    <WorkoutContext.Provider value={{ 
      workoutStart, 
      workoutEnd, 
      workoutCount, 
      startWorkout, 
      endWorkout, 
      incrementWorkoutCount 
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};