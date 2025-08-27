import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, Zap, MapPin, Play, Pause, SkipForward } from "lucide-react";
import { Task, Subtask } from "@/types/scheduler";

interface FocusModeProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, subtaskId: string, completed: boolean, actualMinutes?: number) => void;
}

export const FocusMode = ({ tasks, onTaskUpdate }: FocusModeProps) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Get next 3 uncompleted tasks
  const uncompletedTasks = tasks
    .flatMap(task => 
      task.subtasks
        .filter(subtask => !subtask.completed)
        .map(subtask => ({
          ...subtask,
          taskTitle: task.title,
          taskLocation: task.location,
          taskId: task.id
        }))
    )
    .slice(0, 3);

  const currentTask = uncompletedTasks[currentTaskIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000 / 60));
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, startTime]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      setIsActive(false);
      setTimeSpent(0);
      setStartTime(null);
    };
  }, []);

  const startTask = () => {
    setIsActive(true);
    setStartTime(new Date());
    setTimeSpent(0);
  };

  const pauseTask = () => {
    setIsActive(false);
  };

  const completeTask = () => {
    if (currentTask) {
      onTaskUpdate(currentTask.taskId, currentTask.id, true, timeSpent);
      setIsActive(false);
      setTimeSpent(0);
      setStartTime(null);
      
      // Move to next task
      if (currentTaskIndex < uncompletedTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }
    }
  };

  const skipTask = () => {
    setIsActive(false);
    setTimeSpent(0);
    setStartTime(null);
    
    if (currentTaskIndex < uncompletedTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const getEnergyLevelColor = (level: string) => {
    switch (level) {
      case "high": return "text-task-warning";
      case "medium": return "text-task-secondary";
      case "low": return "text-task-success";
      default: return "text-muted-foreground";
    }
  };

  const getEnergyLevelIcon = (level: string) => {
    switch (level) {
      case "high": return "⚡";
      case "medium": return "🔥";
      case "low": return "🌙";
      default: return "📋";
    }
  };

  if (uncompletedTasks.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-subtle">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-task-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-task-success" />
          </div>
          <h3 className="text-lg font-medium">All Caught Up!</h3>
          <p className="text-muted-foreground">
            You've completed all your tasks. Great job!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Focus Mode
        </h2>
        <p className="text-muted-foreground">
          Concentrate on one task at a time • {uncompletedTasks.length} tasks remaining
        </p>
      </div>

      {/* Current Task */}
      <Card className="p-8 bg-gradient-card">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{currentTask?.title}</h3>
            <p className="text-lg text-muted-foreground">from {currentTask?.taskTitle}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {currentTask?.estimatedMinutes}min estimated
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <span className={getEnergyLevelColor(currentTask?.energyLevel || "")}>
                {getEnergyLevelIcon(currentTask?.energyLevel || "")}
              </span>
              {currentTask?.energyLevel} energy
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {currentTask?.taskLocation}
            </Badge>
          </div>

          {/* Timer */}
          <div className="space-y-4">
            <div className="text-4xl font-bold text-task-primary">
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </div>
            
            {currentTask && (
              <Progress 
                value={(timeSpent / currentTask.estimatedMinutes) * 100} 
                className="w-full max-w-md mx-auto"
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <Button onClick={startTask} size="lg" className="bg-task-success hover:opacity-90">
                <Play className="h-5 w-5 mr-2" />
                Start Task
              </Button>
            ) : (
              <Button onClick={pauseTask} size="lg" variant="outline">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={completeTask} size="lg" className="bg-task-primary hover:bg-task-secondary">
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete
            </Button>
            
            <Button onClick={skipTask} size="lg" variant="outline">
              <SkipForward className="h-5 w-5 mr-2" />
              Skip
            </Button>
          </div>
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Up Next</h3>
        <div className="space-y-3">
          {uncompletedTasks.slice(1, 3).map((task, index) => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <Badge variant="outline" className="text-xs">
                #{index + 2}
              </Badge>
              <div className="flex-1">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">from {task.taskTitle}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.estimatedMinutes}min
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <span className={getEnergyLevelColor(task.energyLevel)}>
                    {getEnergyLevelIcon(task.energyLevel)}
                  </span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};