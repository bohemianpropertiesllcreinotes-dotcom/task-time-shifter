import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, TrendingUp, Calendar, Target } from "lucide-react";
import { Task, WeeklyStats } from "@/types/scheduler";

interface WeeklyReviewProps {
  tasks: Task[];
}

export const WeeklyReview = ({ tasks }: WeeklyReviewProps) => {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = last week, etc.

  const getWeeklyStats = (): WeeklyStats => {
    const completedTasks = tasks.filter(task => 
      task.subtasks.some(subtask => subtask.completed)
    );
    
    const completedSubtasks = tasks.flatMap(task => 
      task.subtasks.filter(subtask => subtask.completed)
    );

    const skippedSubtasks = tasks.flatMap(task => 
      task.subtasks.filter(subtask => !subtask.completed)
    );

    const totalTimeSpent = completedSubtasks.reduce((total, subtask) => 
      total + (subtask.actualMinutes || subtask.estimatedMinutes), 0
    );

    const totalEstimatedTime = completedSubtasks.reduce((total, subtask) => 
      total + subtask.estimatedMinutes, 0
    );

    const averageTaskTime = completedSubtasks.length > 0 
      ? totalTimeSpent / completedSubtasks.length 
      : 0;

    const energyDistribution = completedSubtasks.reduce((acc, subtask) => {
      acc[subtask.energyLevel] = (acc[subtask.energyLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationEfficiency = tasks.reduce((acc, task) => {
      const completedCount = task.subtasks.filter(s => s.completed).length;
      const totalCount = task.subtasks.length;
      const efficiency = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      
      acc[task.location] = Math.max(acc[task.location] || 0, efficiency);
      return acc;
    }, {} as Record<string, number>);

    return {
      tasksCompleted: completedTasks.length,
      tasksSkipped: skippedSubtasks.length,
      totalTimeSpent,
      averageTaskTime,
      streakDays: 5, // Mock streak data
      energyDistribution: energyDistribution as any,
      locationEfficiency: locationEfficiency as any
    };
  };

  const stats = getWeeklyStats();
  const weekLabels = ["This Week", "Last Week", "2 Weeks Ago"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Weekly Review
          </h2>
          <p className="text-muted-foreground">
            Analyze your productivity patterns and achievements
          </p>
        </div>
        <div className="flex gap-2">
          {weekLabels.map((label, index) => (
            <Button
              key={index}
              variant={selectedWeek === index ? "default" : "outline"}
              onClick={() => setSelectedWeek(index)}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center bg-gradient-card">
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 mx-auto text-task-success" />
            <p className="text-2xl font-bold text-task-success">{stats.tasksCompleted}</p>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </div>
        </Card>

        <Card className="p-6 text-center bg-gradient-card">
          <div className="space-y-2">
            <Clock className="h-8 w-8 mx-auto text-task-primary" />
            <p className="text-2xl font-bold text-task-primary">{Math.floor(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}m</p>
            <p className="text-sm text-muted-foreground">Time Invested</p>
          </div>
        </Card>

        <Card className="p-6 text-center bg-gradient-card">
          <div className="space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-task-secondary" />
            <p className="text-2xl font-bold text-task-secondary">{Math.round(stats.averageTaskTime)}min</p>
            <p className="text-sm text-muted-foreground">Avg Task Time</p>
          </div>
        </Card>

        <Card className="p-6 text-center bg-gradient-card">
          <div className="space-y-2">
            <Target className="h-8 w-8 mx-auto text-task-warning" />
            <p className="text-2xl font-bold text-task-warning">{stats.streakDays}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Energy Level Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.energyDistribution).map(([level, count]) => {
              const percentage = (count / Object.values(stats.energyDistribution).reduce((a, b) => a + b, 0)) * 100;
              const icon = level === "high" ? "⚡" : level === "medium" ? "🔥" : "🌙";
              
              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {icon} {level.charAt(0).toUpperCase() + level.slice(1)} Energy
                    </span>
                    <span className="text-sm text-muted-foreground">{count} tasks</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Location Efficiency */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Location Efficiency</h3>
          <div className="space-y-3">
            {Object.entries(stats.locationEfficiency).slice(0, 5).map(([location, efficiency]) => {
              const locationIcons: Record<string, string> = {
                kitchen: "🍳",
                bathroom: "🚿",
                bedroom: "🛏️",
                "living-room": "🛋️",
                office: "💻",
                any: "📍"
              };
              
              return (
                <div key={location} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {locationIcons[location] || "📍"} {location.replace("-", " ")}
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(efficiency)}%</span>
                  </div>
                  <Progress value={efficiency} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6 bg-gradient-subtle">
        <h3 className="text-lg font-semibold mb-4">📊 Weekly Insights</h3>
        <div className="grid gap-3">
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-sm">
              <strong>🎯 Best Performance:</strong> You completed {stats.tasksCompleted} tasks this week, 
              spending an average of {Math.round(stats.averageTaskTime)} minutes per task.
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-sm">
              <strong>⚡ Energy Pattern:</strong> You seem most productive with{" "}
              {Object.entries(stats.energyDistribution).reduce((a, b) => a[1] > b[1] ? a : b, ["", 0])[0]} energy tasks.
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-sm">
              <strong>🏠 Location Success:</strong> Your highest completion rate was in{" "}
              {Object.entries(stats.locationEfficiency).reduce((a, b) => a[1] > b[1] ? a : b, ["", 0])[0].replace("-", " ")}.
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-sm">
              <strong>🔥 Streak Power:</strong> You're on a {stats.streakDays}-day streak! 
              Keep the momentum going by tackling at least one task tomorrow.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};