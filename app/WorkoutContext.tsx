"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type WorkoutContextType = {
  workoutStart: Date | null;
  workoutEnd: Date | null;
  startWorkout: () => void;
  endWorkout: () => void;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workoutStart, setWorkoutStart] = useState<Date | null>(null);
  const [workoutEnd, setWorkoutEnd] = useState<Date | null>(null);

  const startWorkout = () => setWorkoutStart(new Date());
  const endWorkout = () => setWorkoutEnd(new Date());

  return (
    <WorkoutContext.Provider value={{ 
      workoutStart, 
      workoutEnd, 
      startWorkout, 
      endWorkout
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