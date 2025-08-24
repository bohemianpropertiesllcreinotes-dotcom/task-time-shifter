import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Zap, MapPin, CheckCircle } from "lucide-react";
import { Task, TimeSlot, ScheduledSlot, EnergyLevel } from "@/types/scheduler";

interface AutoSchedulerProps {
  tasks: Task[];
  availableSlots: TimeSlot[];
  onScheduleCreated: (scheduledSlots: ScheduledSlot[]) => void;
}

export const AutoScheduler = ({ tasks, availableSlots, onScheduleCreated }: AutoSchedulerProps) => {
  const [scheduledSlots, setScheduledSlots] = useState<ScheduledSlot[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);

  const getEnergyLevelColor = (level: EnergyLevel) => {
    switch (level) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
    }
  };

  const getEnergyLevelIcon = (level: EnergyLevel) => {
    switch (level) {
      case "high": return "⚡";
      case "medium": return "🔥";
      case "low": return "🌙";
    }
  };

  const scheduleTasksIntelligently = () => {
    setIsScheduling(true);
    const newScheduledSlots: ScheduledSlot[] = [];
    
    // Sort tasks by priority (complexity + energy level)
    const sortedTasks = [...tasks].sort((a, b) => {
      const aPriority = (a.complexity === "complex" ? 3 : a.complexity === "moderate" ? 2 : 1) +
                       (a.energyLevel === "high" ? 3 : a.energyLevel === "medium" ? 2 : 1);
      const bPriority = (b.complexity === "complex" ? 3 : b.complexity === "moderate" ? 2 : 1) +
                       (b.energyLevel === "high" ? 3 : b.energyLevel === "medium" ? 2 : 1);
      return bPriority - aPriority;
    });

    let availableSlotsCopy = [...availableSlots];

    sortedTasks.forEach(task => {
      task.subtasks.forEach(subtask => {
        if (subtask.completed) return;

        // Find best matching slot based on energy level and duration
        const requiredTime = subtask.estimatedMinutes + 10; // Add 10min buffer
        
        let bestSlotIndex = -1;
        let bestScore = 0;

        availableSlotsCopy.forEach((slot, index) => {
          if (slot.duration < requiredTime) return;

          let score = 0;
          
          // Energy level matching (morning = high energy, afternoon = medium, evening = low)
          const slotHour = parseInt(slot.start.split(':')[0]);
          const slotEnergyLevel: EnergyLevel = 
            slotHour < 10 ? "high" : 
            slotHour < 16 ? "medium" : "low";
          
          if (slotEnergyLevel === subtask.energyLevel) score += 10;
          else if (
            (slotEnergyLevel === "high" && subtask.energyLevel === "medium") ||
            (slotEnergyLevel === "medium" && subtask.energyLevel === "low")
          ) score += 5;

          // Prefer longer slots for buffer time
          score += Math.min(slot.duration / 60, 2);

          if (score > bestScore) {
            bestScore = score;
            bestSlotIndex = index;
          }
        });

        if (bestSlotIndex !== -1) {
          const slot = availableSlotsCopy[bestSlotIndex];
          const startTime = slot.start;
          const endTimeMinutes = parseInt(slot.start.split(':')[0]) * 60 + 
                                 parseInt(slot.start.split(':')[1]) + subtask.estimatedMinutes;
          const endTime = `${Math.floor(endTimeMinutes / 60).toString().padStart(2, '0')}:${(endTimeMinutes % 60).toString().padStart(2, '0')}`;

          newScheduledSlots.push({
            taskId: task.id,
            subtaskId: subtask.id,
            startTime,
            endTime,
            date: new Date().toISOString().split('T')[0],
            energyLevel: subtask.energyLevel,
            location: task.location,
            bufferMinutes: 10
          });

          // Update available slot
          const remainingDuration = slot.duration - requiredTime;
          if (remainingDuration >= 15) {
            const newStartMinutes = endTimeMinutes + 10; // Add buffer
            const newStartTime = `${Math.floor(newStartMinutes / 60).toString().padStart(2, '0')}:${(newStartMinutes % 60).toString().padStart(2, '0')}`;
            
            availableSlotsCopy[bestSlotIndex] = {
              ...slot,
              start: newStartTime,
              duration: remainingDuration
            };
          } else {
            availableSlotsCopy.splice(bestSlotIndex, 1);
          }
        }
      });
    });

    setScheduledSlots(newScheduledSlots);
    setIsScheduling(false);
  };

  const applySchedule = () => {
    onScheduleCreated(scheduledSlots);
  };

  const uncompletedSubtasks = tasks.flatMap(task => 
    task.subtasks.filter(subtask => !subtask.completed).map(subtask => ({
      ...subtask,
      taskTitle: task.title,
      taskLocation: task.location
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart Scheduler
          </h2>
          <p className="text-muted-foreground">
            Automatically schedule {uncompletedSubtasks.length} tasks around your obligations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={scheduleTasksIntelligently}
            disabled={isScheduling}
            className="bg-task-primary hover:bg-task-secondary"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isScheduling ? "Scheduling..." : "Schedule This Week"}
          </Button>
          {scheduledSlots.length > 0 && (
            <Button 
              onClick={applySchedule}
              className="bg-task-success hover:opacity-90"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Schedule
            </Button>
          )}
        </div>
      </div>

      {scheduledSlots.length > 0 && (
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-4">Proposed Schedule</h3>
          <div className="space-y-3">
            {scheduledSlots.map((slot, index) => {
              const task = tasks.find(t => t.id === slot.taskId);
              const subtask = task?.subtasks.find(s => s.id === slot.subtaskId);
              
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {slot.startTime} - {slot.endTime}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{subtask?.title}</p>
                    <p className="text-sm text-muted-foreground">from {task?.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <span className={getEnergyLevelColor(slot.energyLevel)}>
                        {getEnergyLevelIcon(slot.energyLevel)}
                      </span>
                      {slot.energyLevel}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {slot.location}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {scheduledSlots.length === 0 && !isScheduling && (
        <Card className="p-12 text-center bg-gradient-subtle">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-task-primary/10 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-task-primary" />
            </div>
            <h3 className="text-lg font-medium">Ready to Schedule</h3>
            <p className="text-muted-foreground">
              Click "Schedule This Week" to automatically place your tasks in optimal time slots
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};