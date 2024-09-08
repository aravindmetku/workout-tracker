"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SkipForward, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWorkout } from './WorkoutContext';
import { useWorkoutHistory } from './WorkoutHistoryContext';

type Exercise = {
  name: string
  sets: number
  reps: number[]
  image: string
}

type Workout = {
  name: string
  exercises: Exercise[]
}

const workoutProgram: Record<string, Workout> = {
  "Shoulders, Chest & Triceps": {
    name: "Shoulders, Chest & Triceps",
    exercises: [
      { name: "Shoulder Press", sets: 4, reps: [12, 10, 8, 6], image: "/placeholder.svg?height=300&width=300" },
      { name: "Chest Press", sets: 4, reps: [12, 10, 8, 6], image: "/placeholder.svg?height=300&width=300" },
      { name: "Lateral Raises", sets: 4, reps: [8, 6, 4, 4], image: "/placeholder.svg?height=300&width=300" },
      { name: "Tricep Extensions", sets: 4, reps: [8, 4, 4, 3], image: "/placeholder.svg?height=300&width=300" },
    ],
  },
  "Back & Biceps": {
    name: "Back & Biceps",
    exercises: [
      { name: "Bicep Curls", sets: 4, reps: [12, 10, 8, 6], image: "/placeholder.svg?height=300&width=300" },
      { name: "Deadlifts", sets: 4, reps: [8, 6, 6, 4], image: "/placeholder.svg?height=300&width=300" },
      { name: "Upright Rows", sets: 4, reps: [10, 8, 6, 4], image: "/placeholder.svg?height=300&width=300" },
      { name: "Hammer Curls", sets: 4, reps: [10, 8, 6, 4], image: "/placeholder.svg?height=300&width=300" },
    ],
  },
  "Leg Day": {
    name: "Leg Day",
    exercises: [
      { name: "Goblet Squats", sets: 4, reps: [12, 10, 8, 8], image: "/placeholder.svg?height=300&width=300" },
      { name: "Forward Lunges", sets: 4, reps: [8, 4, 4, 3], image: "/placeholder.svg?height=300&width=300" },
      { name: "Side Lunges", sets: 4, reps: [8, 4, 4, 3], image: "/placeholder.svg?height=300&width=300" },
      { name: "Calf Raises", sets: 4, reps: [12, 12, 10, 10], image: "/placeholder.svg?height=300&width=300" },
    ],
  },
  "Ab Work": {
    name: "Ab Work",
    exercises: [
      { name: "Sit-ups", sets: 4, reps: [16, 14, 14, 10], image: "/placeholder.svg?height=300&width=300" },
      { name: "Sitting Twists", sets: 4, reps: [8, 6, 6, 6], image: "/placeholder.svg?height=300&width=300" },
      { name: "Leg Raises", sets: 4, reps: [14, 14, 12, 10], image: "/placeholder.svg?height=300&width=300" },
      { name: "Flutter Kicks", sets: 4, reps: [14, 14, 12, 8], image: "/placeholder.svg?height=300&width=300" },
    ],
  },
}

export default function WorkoutTracker() {
  const { 
    startWorkout: contextStartWorkout, 
    endWorkout: contextEndWorkout
  } = useWorkout();
  const { addWorkout, workoutHistory } = useWorkoutHistory();
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const { toast } = useToast()
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  const workoutCount = workoutHistory.length;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (selectedWorkout) {
      interval = setInterval(() => {
        if (!isResting) {
          setTimer((prevTimer) => prevTimer + 1)
        } else {
          setTimer((prevTimer) => Math.max(prevTimer - 1, 0))
        }
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedWorkout, isResting])

  useEffect(() => {
    if (isResting && timer === 0) {
      endRest()
    }
  }, [isResting, timer])

  const startWorkout = (workoutName: string) => {
    contextStartWorkout();
    setWorkoutStartTime(new Date());
    setSelectedWorkout(workoutName);
    setCurrentExercise(0);
    setCurrentSet(0);
    setTimer(0);
    setIsResting(false);

    // Show toast with new workout count
    toast({
      title: "Workout Started",
      description: `This is workout #${workoutCount + 1}. Let's go!`,
    });
  }

  const startRest = (duration: number) => {
    setIsResting(true)
    setTimer(duration)
  }

  const endRest = () => {
    setIsResting(false)
    if (currentSet < workoutProgram[selectedWorkout!].exercises[currentExercise].sets - 1) {
      setCurrentSet((prevSet) => prevSet + 1)
    } else {
      nextExercise()
    }
  }

  const skipRest = () => {
    endRest()
  }

  const completeSet = () => {
    if (currentSet < workoutProgram[selectedWorkout!].exercises[currentExercise].sets - 1) {
      startRest(30) // 30 seconds rest between sets
    } else {
      startRest(120) // 2 minutes rest between exercises
    }
  }

  const nextExercise = () => {
    if (currentExercise < workoutProgram[selectedWorkout!].exercises.length - 1) {
      setCurrentExercise((prevExercise) => prevExercise + 1)
      setCurrentSet(0)
    } else {
      finishWorkout()
    }
  }

  const finishWorkout = () => {
    contextEndWorkout();
    const endTime = new Date();
    const duration = workoutStartTime ? Math.round((endTime.getTime() - workoutStartTime.getTime()) / 60000) : 0;

    addWorkout({
      name: selectedWorkout!,
      date: workoutStartTime!,
      duration: duration,
      exercises: workoutProgram[selectedWorkout!].exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
      })),
    });

    toast({
      title: "Workout Complete!",
      description: `You've completed the ${selectedWorkout} workout. Great job!`,
    });
    setSelectedWorkout(null);
    setCurrentExercise(0);
    setCurrentSet(0);
    setTimer(0);
    setIsResting(false);
  }

  const renderDashboard = () => (
    <div className="space-y-4">
      <p className="text-lg font-semibold">Total Workouts Completed: {workoutCount}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(workoutProgram).map((workoutName) => (
          <Card key={workoutName} className="cursor-pointer hover:bg-secondary" onClick={() => startWorkout(workoutName)}>
            <CardHeader>
              <CardTitle>{workoutName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{workoutProgram[workoutName].exercises.length} exercises</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderWorkout = () => {
    const workout = workoutProgram[selectedWorkout!]
    const currentExerciseData = workout.exercises[currentExercise]

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{workout.name}</span>
            <Button variant="ghost" size="icon" onClick={finishWorkout}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{currentExerciseData.name}</h2>
            <div className="flex justify-center">
              <Image
                src={currentExerciseData.image}
                alt={currentExerciseData.name}
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
            <p>Set {currentSet + 1} of {currentExerciseData.sets}</p>
            <p>Reps: {currentExerciseData.reps[currentSet]}</p>
            <Progress value={(currentSet / currentExerciseData.sets) * 100} />
            {isResting ? (
              <div>
                <p>Rest Time: {timer} seconds</p>
                <Progress value={(timer / (currentSet === currentExerciseData.sets - 1 ? 120 : 30)) * 100} />
                <Button onClick={skipRest} className="mt-2">
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip Rest
                </Button>
              </div>
            ) : (
              <div>
                <p>Set Timer: {timer} seconds</p>
                <Button onClick={completeSet} className="mt-2">Complete Set</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Workout Tracker</h1>
      {selectedWorkout ? renderWorkout() : renderDashboard()}
      {selectedWorkout && (
        <div className="mt-4">
          <p>Exercise {currentExercise + 1} of {workoutProgram[selectedWorkout].exercises.length}</p>
          <Progress 
            value={
              ((currentExercise * workoutProgram[selectedWorkout].exercises[currentExercise].sets + currentSet) / 
              (workoutProgram[selectedWorkout].exercises.length * workoutProgram[selectedWorkout].exercises[currentExercise].sets)) * 100
            } 
          />
        </div>
      )}
    </div>
  )
}