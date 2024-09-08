import WorkoutTracker from "./tracker";
import { CurrentWorkoutProvider } from "./WorkoutContext";

export default function Home() {
  return (
    <CurrentWorkoutProvider>
      <div className="min-h-screen">
        <WorkoutTracker />
      </div>
    </CurrentWorkoutProvider>
  );
}
