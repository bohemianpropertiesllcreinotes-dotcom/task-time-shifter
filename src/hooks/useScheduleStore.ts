import { useState, useCallback } from 'react';
import { Task, ScheduledSlot, Obligation, TimeSlot, EnergyLevel } from '@/types/scheduler';

export const useScheduleStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledSlots, setScheduledSlots] = useState<ScheduledSlot[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([
    // User's actual weekly schedule
    { id: "work-mon", title: "Work", startTime: "09:00", endTime: "18:00", type: "work", day: "monday" },
    { id: "work-tue", title: "Work", startTime: "09:00", endTime: "18:00", type: "work", day: "tuesday" },
    { id: "work-wed", title: "Work", startTime: "09:00", endTime: "18:00", type: "work", day: "wednesday" },
    { id: "work-thu", title: "Work", startTime: "09:00", endTime: "18:00", type: "work", day: "thursday" },
    { id: "work-fri", title: "Work", startTime: "09:00", endTime: "18:00", type: "work", day: "friday" },
    { id: "side-mon", title: "Side Job", startTime: "19:00", endTime: "21:00", type: "work", day: "monday" },
    { id: "side-wed", title: "Side Job", startTime: "19:00", endTime: "21:00", type: "work", day: "wednesday" },
    { id: "side-fri", title: "Side Job", startTime: "19:00", endTime: "21:00", type: "work", day: "friday" },
    { id: "bible-tue", title: "Bible Study", startTime: "19:00", endTime: "21:00", type: "personal", day: "tuesday" },
    { id: "church-sun", title: "Church", startTime: "11:00", endTime: "13:00", type: "personal", day: "sunday" },
  ]);

  const generateAvailableSlots = useCallback((day: string = "today"): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayStart = 6; // 6 AM
    const dayEnd = 23; // 11 PM
    
    // Get obligations for the specific day
    const dayObligations = obligations.filter(o => 
      day === "today" || o.day === day.toLowerCase()
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    let currentHour = dayStart;
    let currentMinute = 0;

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return { hour: hours, minute: minutes, totalMinutes: hours * 60 + minutes };
    };

    const formatTime = (hour: number, minute: number) => {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };

    const getEnergyLevel = (hour: number): EnergyLevel => {
      if (hour >= 6 && hour < 10) return "high"; // Morning high energy
      if (hour >= 10 && hour < 14) return "medium"; // Late morning/early afternoon
      if (hour >= 14 && hour < 17) return "medium"; // Afternoon
      if (hour >= 17 && hour < 20) return "low"; // Evening
      return "low"; // Night
    };

    for (const obligation of dayObligations) {
      const obligationStart = parseTime(obligation.startTime);
      const obligationEnd = parseTime(obligation.endTime);
      
      // Add buffer before work obligations
      const bufferBefore = obligation.type === "work" ? 30 : 15;
      const adjustedStart = obligationStart.totalMinutes - bufferBefore;
      
      // Add available slot before obligation if there's time
      if (currentHour * 60 + currentMinute < adjustedStart) {
        const availableMinutes = adjustedStart - (currentHour * 60 + currentMinute);
        if (availableMinutes >= 30) { // Only slots of 30+ minutes
          const slotStartHour = Math.floor((currentHour * 60 + currentMinute) / 60);
          const slotStartMinute = (currentHour * 60 + currentMinute) % 60;
          
          slots.push({
            start: formatTime(slotStartHour, slotStartMinute),
            end: formatTime(Math.floor(adjustedStart / 60), adjustedStart % 60),
            duration: availableMinutes,
            available: true,
            energyLevel: getEnergyLevel(slotStartHour),
            bufferBefore: 0,
            bufferAfter: bufferBefore
          });
        }
      }
      
      // Update current time to after obligation + buffer
      const bufferAfter = obligation.type === "work" ? 30 : 15;
      const nextAvailableTime = obligationEnd.totalMinutes + bufferAfter;
      currentHour = Math.floor(nextAvailableTime / 60);
      currentMinute = nextAvailableTime % 60;
    }
    
    // Add final available slot if there's time left in the day
    const dayEndMinutes = dayEnd * 60;
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    if (currentTotalMinutes < dayEndMinutes) {
      const remainingMinutes = dayEndMinutes - currentTotalMinutes;
      if (remainingMinutes >= 30) {
        slots.push({
          start: formatTime(currentHour, currentMinute),
          end: formatTime(dayEnd, 0),
          duration: remainingMinutes,
          available: true,
          energyLevel: getEnergyLevel(currentHour),
          bufferBefore: 0,
          bufferAfter: 0
        });
      }
    }
    
    return slots;
  }, [obligations]);

  const updateTask = useCallback((taskId: string, subtaskId: string, completed: boolean, actualMinutes?: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
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
      )
    );
  }, []);

  const addObligation = useCallback((obligation: Omit<Obligation, 'id'>) => {
    const newObligation = {
      ...obligation,
      id: Date.now().toString()
    };
    setObligations(prev => [...prev, newObligation]);
  }, []);

  const removeObligation = useCallback((id: string) => {
    setObligations(prev => prev.filter(o => o.id !== id));
  }, []);

  return {
    tasks,
    setTasks,
    scheduledSlots,
    setScheduledSlots,
    obligations,
    generateAvailableSlots,
    updateTask,
    addObligation,
    removeObligation
  };
};