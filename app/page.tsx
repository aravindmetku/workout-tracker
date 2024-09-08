import WorkoutTracker from "./tracker";
import { WorkoutProvider } from "./WorkoutContext";

export default function Home() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen">
        <WorkoutTracker />
      </div>
    </WorkoutProvider>
  );
}
