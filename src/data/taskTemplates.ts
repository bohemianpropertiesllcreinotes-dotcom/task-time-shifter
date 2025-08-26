import { TaskTemplate, EnergyLevel, TaskLocation, TaskComplexity } from '@/types/scheduler';

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "clean-kitchen",
    name: "Clean Kitchen",
    description: "Complete kitchen cleaning routine",
    energyLevel: "medium" as EnergyLevel,
    location: "kitchen" as TaskLocation,
    complexity: "moderate" as TaskComplexity,
    subtasks: [
      { title: "Clear and wipe all counters", estimatedMinutes: 10, energyLevel: "low", location: "kitchen" },
      { title: "Load/run dishwasher or wash dishes", estimatedMinutes: 15, energyLevel: "medium", location: "kitchen" },
      { title: "Clean stovetop and microwave", estimatedMinutes: 10, energyLevel: "medium", location: "kitchen" },
      { title: "Sweep and mop floor", estimatedMinutes: 15, energyLevel: "medium", location: "kitchen" },
      { title: "Organize pantry and cabinets", estimatedMinutes: 20, energyLevel: "high", location: "kitchen" },
      { title: "Clean sink and faucet", estimatedMinutes: 5, energyLevel: "low", location: "kitchen" }
    ]
  },
  {
    id: "clean-bathroom",
    name: "Clean Bathroom",
    description: "Thorough bathroom cleaning",
    energyLevel: "medium" as EnergyLevel,
    location: "bathroom" as TaskLocation,
    complexity: "moderate" as TaskComplexity,
    subtasks: [
      { title: "Clean toilet (inside and outside)", estimatedMinutes: 10, energyLevel: "medium", location: "bathroom" },
      { title: "Scrub shower/tub and tiles", estimatedMinutes: 20, energyLevel: "high", location: "bathroom" },
      { title: "Clean mirror and light fixtures", estimatedMinutes: 5, energyLevel: "low", location: "bathroom" },
      { title: "Sweep and mop floor", estimatedMinutes: 10, energyLevel: "medium", location: "bathroom" },
      { title: "Organize medicine cabinet and supplies", estimatedMinutes: 10, energyLevel: "medium", location: "bathroom" },
      { title: "Replace towels and restock supplies", estimatedMinutes: 5, energyLevel: "low", location: "bathroom" }
    ]
  },
  {
    id: "clean-bedroom",
    name: "Clean Bedroom",
    description: "Organize and clean bedroom space",
    energyLevel: "medium" as EnergyLevel,
    location: "bedroom" as TaskLocation,
    complexity: "simple" as TaskComplexity,
    subtasks: [
      { title: "Make bed and organize pillows", estimatedMinutes: 5, energyLevel: "low", location: "bedroom" },
      { title: "Put away clothes and organize closet", estimatedMinutes: 20, energyLevel: "medium", location: "bedroom" },
      { title: "Dust surfaces (dresser, nightstands)", estimatedMinutes: 10, energyLevel: "low", location: "bedroom" },
      { title: "Vacuum or sweep floor", estimatedMinutes: 10, energyLevel: "medium", location: "bedroom" },
      { title: "Organize personal items", estimatedMinutes: 15, energyLevel: "medium", location: "bedroom" }
    ]
  },
  {
    id: "clean-living-room",
    name: "Clean Living Room",
    description: "Tidy and clean main living space",
    energyLevel: "medium" as EnergyLevel,
    location: "living-room" as TaskLocation,
    complexity: "simple" as TaskComplexity,
    subtasks: [
      { title: "Pick up and organize items", estimatedMinutes: 15, energyLevel: "low", location: "living-room" },
      { title: "Dust furniture and electronics", estimatedMinutes: 15, energyLevel: "low", location: "living-room" },
      { title: "Vacuum or sweep floor", estimatedMinutes: 15, energyLevel: "medium", location: "living-room" },
      { title: "Fluff cushions and fold blankets", estimatedMinutes: 5, energyLevel: "low", location: "living-room" },
      { title: "Organize entertainment center", estimatedMinutes: 10, energyLevel: "medium", location: "living-room" }
    ]
  },
  {
    id: "clean-car",
    name: "Clean Car",
    description: "Interior and exterior car cleaning",
    energyLevel: "high" as EnergyLevel,
    location: "car" as TaskLocation,
    complexity: "moderate" as TaskComplexity,
    subtasks: [
      { title: "Remove trash and personal items", estimatedMinutes: 10, energyLevel: "low", location: "car" },
      { title: "Vacuum interior (seats, floor, trunk)", estimatedMinutes: 20, energyLevel: "medium", location: "car" },
      { title: "Wipe dashboard and console", estimatedMinutes: 10, energyLevel: "low", location: "car" },
      { title: "Clean windows (inside and outside)", estimatedMinutes: 15, energyLevel: "medium", location: "car" },
      { title: "Wash exterior and wheels", estimatedMinutes: 30, energyLevel: "high", location: "car" },
      { title: "Organize trunk and glove compartment", estimatedMinutes: 10, energyLevel: "medium", location: "car" }
    ]
  },
  {
    id: "clean-garage",
    name: "Clean Garage",
    description: "Organize and clean garage space",
    energyLevel: "high" as EnergyLevel,
    location: "garage" as TaskLocation,
    complexity: "complex" as TaskComplexity,
    subtasks: [
      { title: "Sort and categorize items", estimatedMinutes: 45, energyLevel: "high", location: "garage" },
      { title: "Organize tools and equipment", estimatedMinutes: 30, energyLevel: "medium", location: "garage" },
      { title: "Sweep floor and remove debris", estimatedMinutes: 20, energyLevel: "medium", location: "garage" },
      { title: "Install or reorganize storage systems", estimatedMinutes: 60, energyLevel: "high", location: "garage" },
      { title: "Dispose of unwanted items", estimatedMinutes: 20, energyLevel: "medium", location: "garage" }
    ]
  },
  {
    id: "clean-storage",
    name: "Clean Storage",
    description: "Organize storage areas and closets",
    energyLevel: "high" as EnergyLevel,
    location: "storage" as TaskLocation,
    complexity: "complex" as TaskComplexity,
    subtasks: [
      { title: "Remove everything and assess", estimatedMinutes: 30, energyLevel: "medium", location: "storage" },
      { title: "Sort items into keep/donate/discard", estimatedMinutes: 60, energyLevel: "high", location: "storage" },
      { title: "Clean shelves and storage area", estimatedMinutes: 20, energyLevel: "medium", location: "storage" },
      { title: "Organize remaining items with labels", estimatedMinutes: 45, energyLevel: "high", location: "storage" },
      { title: "Create inventory list", estimatedMinutes: 15, energyLevel: "low", location: "storage" }
    ]
  },
  {
    id: "meal-prep",
    name: "Weekly Meal Prep",
    description: "Plan and prepare meals for the week",
    energyLevel: "high" as EnergyLevel,
    location: "kitchen" as TaskLocation,
    complexity: "complex" as TaskComplexity,
    subtasks: [
      { title: "Plan weekly menu and create shopping list", estimatedMinutes: 30, energyLevel: "medium", location: "office" },
      { title: "Shop for groceries and ingredients", estimatedMinutes: 60, energyLevel: "medium", location: "any" },
      { title: "Prep vegetables and ingredients", estimatedMinutes: 45, energyLevel: "medium", location: "kitchen" },
      { title: "Cook base proteins and grains", estimatedMinutes: 90, energyLevel: "high", location: "kitchen" },
      { title: "Portion and store meals", estimatedMinutes: 30, energyLevel: "medium", location: "kitchen" },
      { title: "Label containers with dates", estimatedMinutes: 10, energyLevel: "low", location: "kitchen" }
    ]
  },
  {
    id: "daily-reading",
    name: "Daily Reading",
    description: "Read one chapter from current book",
    energyLevel: "low" as EnergyLevel,
    location: "any" as TaskLocation,
    complexity: "simple" as TaskComplexity,
    subtasks: [
      { title: "Find comfortable reading spot", estimatedMinutes: 2, energyLevel: "low", location: "any" },
      { title: "Read one chapter (20-30 pages)", estimatedMinutes: 25, energyLevel: "low", location: "any" },
      { title: "Take notes or highlight key points", estimatedMinutes: 8, energyLevel: "low", location: "any" },
      { title: "Update reading log/progress", estimatedMinutes: 5, energyLevel: "low", location: "any" }
    ]
  },
  {
    id: "school-assignment",
    name: "School Assignment",
    description: "Complete online college coursework",
    energyLevel: "high" as EnergyLevel,
    location: "office" as TaskLocation,
    complexity: "complex" as TaskComplexity,
    subtasks: [
      { title: "Review assignment requirements", estimatedMinutes: 15, energyLevel: "medium", location: "office" },
      { title: "Research and gather resources", estimatedMinutes: 45, energyLevel: "high", location: "office" },
      { title: "Create outline or plan", estimatedMinutes: 20, energyLevel: "medium", location: "office" },
      { title: "Write/complete main assignment", estimatedMinutes: 90, energyLevel: "high", location: "office" },
      { title: "Review and edit work", estimatedMinutes: 30, energyLevel: "medium", location: "office" },
      { title: "Submit assignment", estimatedMinutes: 10, energyLevel: "low", location: "office" }
    ]
  }
];

export const getTaskTemplate = (id: string): TaskTemplate | undefined => {
  return TASK_TEMPLATES.find(template => template.id === id);
};

export const getTasksByLocation = (location: TaskLocation): TaskTemplate[] => {
  return TASK_TEMPLATES.filter(template => template.location === location);
};

export const getTasksByEnergyLevel = (energyLevel: EnergyLevel): TaskTemplate[] => {
  return TASK_TEMPLATES.filter(template => template.energyLevel === energyLevel);
};