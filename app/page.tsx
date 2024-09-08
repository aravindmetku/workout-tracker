import WorkoutTracker from "./tracker";
import { WorkoutProvider } from './WorkoutContext';
import { WorkoutHistoryProvider } from './WorkoutHistoryContext';

export default function Home() {
  return (
    <WorkoutProvider>
      <WorkoutHistoryProvider>
        <div className="min-h-screen">
          <WorkoutTracker />
        </div>
      </WorkoutHistoryProvider>
    </WorkoutProvider>
  );
}
