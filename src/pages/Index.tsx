import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBreakdown } from "@/components/TaskBreakdown";
import { ScheduleView } from "@/components/ScheduleView";
import { AutoScheduler } from "@/components/AutoScheduler";
import { FocusMode } from "@/components/FocusMode";
import { WeeklyReview } from "@/components/WeeklyReview";
import { Calendar, ListTodo, Brain, Zap, Target, BarChart3 } from "lucide-react";
import { Task, TimeSlot, ScheduledSlot } from "@/types/scheduler";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledSlots, setScheduledSlots] = useState<ScheduledSlot[]>([]);

  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleTaskUpdate = (taskId: string, subtaskId: string, completed: boolean, actualMinutes?: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId 
                ? { 
                    ...subtask, 
                    completed,
                    actualMinutes,
                    completedAt: completed ? new Date() : undefined
                  }
                : subtask
            )
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const handleScheduleCreated = (slots: ScheduledSlot[]) => {
    setScheduledSlots(slots);
  };

  // Mock available time slots for the scheduler
  const mockAvailableSlots: TimeSlot[] = [
    { start: "07:00", end: "09:00", duration: 120, available: true, energyLevel: "high" },
    { start: "18:00", end: "19:00", duration: 60, available: true, energyLevel: "medium" },
    { start: "20:00", end: "22:00", duration: 120, available: true, energyLevel: "low" },
  ];
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Smart Task Scheduler
              </h1>
            </div>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Smart task scheduling around your daily commitments
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Smart Task Scheduler
          </h2>
          <p className="text-lg text-muted-foreground">
            Break down overwhelming tasks, match them to your energy levels, and schedule them intelligently around your commitments.
          </p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="auto-schedule" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Auto Schedule
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Focus Mode
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskBreakdown onTasksChange={handleTasksChange} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleView />
          </TabsContent>

          <TabsContent value="auto-schedule">
            <AutoScheduler 
              tasks={tasks}
              availableSlots={mockAvailableSlots}
              onScheduleCreated={handleScheduleCreated}
            />
          </TabsContent>

          <TabsContent value="focus">
            <FocusMode 
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
            />
          </TabsContent>

          <TabsContent value="insights">
            <WeeklyReview tasks={tasks} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;