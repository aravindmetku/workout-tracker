import WorkoutTracker from "./tracker";
import { WorkoutProvider } from './WorkoutContext';
import { WorkoutHistoryProvider } from './WorkoutHistoryContext';
import ClearHistoryButton from '@/components/ui/ClearHistoryButton';

export default function Home() {
  return (
    <div>
      <WorkoutProvider>
        <WorkoutHistoryProvider>
          <div className="min-h-screen">
            <WorkoutTracker />
          </div>
          <ClearHistoryButton />
        </WorkoutHistoryProvider>
      </WorkoutProvider>

    </div>
  );
}
