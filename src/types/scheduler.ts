export type EnergyLevel = "low" | "medium" | "high";
export type TaskLocation = "kitchen" | "bathroom" | "bedroom" | "living-room" | "car" | "garage" | "storage" | "office" | "any";
export type TaskComplexity = "simple" | "moderate" | "complex";

export interface Subtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  energyLevel: EnergyLevel;
  location?: TaskLocation;
  actualMinutes?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  energyLevel: EnergyLevel;
  location: TaskLocation;
  complexity: TaskComplexity;
  totalEstimatedMinutes: number;
  scheduledSlots?: ScheduledSlot[];
  isRecurring?: boolean;
  lastCompleted?: Date;
  streak?: number;
  template?: boolean;
}

export interface Obligation {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "work" | "personal" | "appointment";
  day?: string; // For weekly obligations
}

export interface TimeSlot {
  start: string;
  end: string;
  duration: number;
  available: boolean;
  energyLevel?: EnergyLevel;
  bufferBefore?: number;
  bufferAfter?: number;
}

export interface ScheduledSlot {
  taskId: string;
  subtaskId?: string;
  startTime: string;
  endTime: string;
  date: string;
  energyLevel: EnergyLevel;
  location: TaskLocation;
  bufferMinutes: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  subtasks: Omit<Subtask, 'id' | 'completed'>[];
  energyLevel: EnergyLevel;
  location: TaskLocation;
  complexity: TaskComplexity;
}

export interface WeeklyStats {
  tasksCompleted: number;
  tasksSkipped: number;
  totalTimeSpent: number;
  averageTaskTime: number;
  streakDays: number;
  energyDistribution: Record<EnergyLevel, number>;
  locationEfficiency: Record<TaskLocation, number>;
}