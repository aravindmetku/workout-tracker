"use client"

import React, { useState } from 'react';
import { useWorkoutHistory } from '../../app/WorkoutHistoryContext';

export default function ClearHistoryButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { clearWorkoutHistory } = useWorkoutHistory();

  const handleClearHistory = () => {
    setShowConfirmation(true);
  };

  const confirmClearHistory = () => {
    clearWorkoutHistory();
    setShowConfirmation(false);
  };

  return (
    <>
      <button onClick={handleClearHistory} className="bg-red-500 text-white px-4 py-2 rounded">
        Clear Workout History
      </button>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>Are you sure you want to clear all workout history?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setShowConfirmation(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={confirmClearHistory} className="bg-red-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}