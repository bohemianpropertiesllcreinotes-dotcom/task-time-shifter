import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, CheckCircle, Circle, Zap, MapPin, Save } from "lucide-react";
import { Task, Subtask, EnergyLevel, TaskLocation, TaskComplexity, TaskTemplate } from "@/types/scheduler";

interface TaskBreakdownProps {
  onTasksChange?: (tasks: Task[]) => void;
}

export const TaskBreakdown = ({ onTasksChange }: TaskBreakdownProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([
    {
      id: "clean-kitchen",
      name: "Kitchen Deep Clean",
      description: "Complete kitchen cleaning routine",
      subtasks: [
        { title: "Clear and wipe counters", estimatedMinutes: 10, energyLevel: "medium", location: "kitchen" },
        { title: "Load/run dishwasher", estimatedMinutes: 5, energyLevel: "low", location: "kitchen" },
        { title: "Clean stovetop and oven", estimatedMinutes: 15, energyLevel: "high", location: "kitchen" },
        { title: "Sweep and mop floor", estimatedMinutes: 15, energyLevel: "medium", location: "kitchen" },
        { title: "Organize cabinets", estimatedMinutes: 20, energyLevel: "low", location: "kitchen" }
      ],
      energyLevel: "medium",
      location: "kitchen",
      complexity: "moderate"
    },
    {
      id: "exercise-routine",
      name: "Complete Workout",
      description: "Full exercise session with warm-up and cool-down",
      subtasks: [
        { title: "Change into workout clothes", estimatedMinutes: 5, energyLevel: "low", location: "bedroom" },
        { title: "10-minute warm-up", estimatedMinutes: 10, energyLevel: "medium", location: "any" },
        { title: "Main workout routine", estimatedMinutes: 30, energyLevel: "high", location: "any" },
        { title: "Cool down and stretch", estimatedMinutes: 10, energyLevel: "low", location: "any" },
        { title: "Shower and change", estimatedMinutes: 15, energyLevel: "low", location: "bathroom" }
      ],
      energyLevel: "high",
      location: "any",
      complexity: "moderate"
    }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskEnergyLevel, setNewTaskEnergyLevel] = useState<EnergyLevel>("medium");
  const [newTaskLocation, setNewTaskLocation] = useState<TaskLocation>("any");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  const generateSubtasks = (title: string, description: string, location: TaskLocation, energyLevel: EnergyLevel): Subtask[] => {
    // Smart subtask generation based on common task patterns
    const taskLower = title.toLowerCase();
    let subtasks: Subtask[] = [];

    if (taskLower.includes("clean kitchen")) {
      subtasks = [
        { id: "1", title: "Clear and wipe counters", estimatedMinutes: 10, completed: false, energyLevel: "medium", location: "kitchen" },
        { id: "2", title: "Load/run dishwasher", estimatedMinutes: 5, completed: false, energyLevel: "low", location: "kitchen" },
        { id: "3", title: "Clean stovetop", estimatedMinutes: 10, completed: false, energyLevel: "high", location: "kitchen" },
        { id: "4", title: "Sweep and mop floor", estimatedMinutes: 15, completed: false, energyLevel: "medium", location: "kitchen" },
      ];
    } else if (taskLower.includes("clean bathroom")) {
      subtasks = [
        { id: "1", title: "Clear surfaces and counter", estimatedMinutes: 5, completed: false, energyLevel: "low", location: "bathroom" },
        { id: "2", title: "Clean toilet", estimatedMinutes: 10, completed: false, energyLevel: "medium", location: "bathroom" },
        { id: "3", title: "Clean shower/tub", estimatedMinutes: 15, completed: false, energyLevel: "high", location: "bathroom" },
        { id: "4", title: "Mop floor", estimatedMinutes: 10, completed: false, energyLevel: "medium", location: "bathroom" },
      ];
    } else if (taskLower.includes("clean storage")) {
      subtasks = [
        { id: "1", title: "Sort items by category", estimatedMinutes: 20, completed: false, energyLevel: "medium", location: "storage" },
        { id: "2", title: "Donate/discard unused items", estimatedMinutes: 15, completed: false, energyLevel: "low", location: "storage" },
        { id: "3", title: "Organize remaining items", estimatedMinutes: 25, completed: false, energyLevel: "medium", location: "storage" },
        { id: "4", title: "Label containers/shelves", estimatedMinutes: 10, completed: false, energyLevel: "low", location: "storage" },
      ];
    } else if (taskLower.includes("exercise") || taskLower.includes("workout")) {
      subtasks = [
        { id: "1", title: "Change into workout clothes", estimatedMinutes: 5, completed: false, energyLevel: "low", location: "bedroom" },
        { id: "2", title: "5-minute warm-up", estimatedMinutes: 5, completed: false, energyLevel: "medium", location },
        { id: "3", title: "Main workout routine", estimatedMinutes: 25, completed: false, energyLevel: "high", location },
        { id: "4", title: "Cool down and stretch", estimatedMinutes: 10, completed: false, energyLevel: "low", location },
      ];
    } else if (taskLower.includes("study") || taskLower.includes("learn") || taskLower.includes("assignment")) {
      subtasks = [
        { id: "1", title: "Review previous material", estimatedMinutes: 10, completed: false, energyLevel: "medium", location: "office" },
        { id: "2", title: "Read new chapter/material", estimatedMinutes: 20, completed: false, energyLevel: "high", location: "office" },
        { id: "3", title: "Take notes on key points", estimatedMinutes: 15, completed: false, energyLevel: "medium", location: "office" },
        { id: "4", title: "Practice problems/review", estimatedMinutes: 15, completed: false, energyLevel: "high", location: "office" },
      ];
    } else if (taskLower.includes("meal prep")) {
      subtasks = [
        { id: "1", title: "Plan meals for the week", estimatedMinutes: 15, completed: false, energyLevel: "medium", location: "kitchen" },
        { id: "2", title: "Prep vegetables and ingredients", estimatedMinutes: 20, completed: false, energyLevel: "medium", location: "kitchen" },
        { id: "3", title: "Cook base proteins/grains", estimatedMinutes: 30, completed: false, energyLevel: "high", location: "kitchen" },
        { id: "4", title: "Portion and store meals", estimatedMinutes: 15, completed: false, energyLevel: "low", location: "kitchen" },
      ];
    } else {
      // Generic breakdown
      subtasks = [
        { id: "1", title: "Plan and prepare", estimatedMinutes: 10, completed: false, energyLevel: "medium", location },
        { id: "2", title: "Start main work", estimatedMinutes: 20, completed: false, energyLevel, location },
        { id: "3", title: "Complete and review", estimatedMinutes: 10, completed: false, energyLevel: "low", location },
      ];
    }

    return subtasks;
  };

  const addTaskFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const subtasks: Subtask[] = template.subtasks.map((subtask, index) => ({
      id: (index + 1).toString(),
      title: subtask.title,
      estimatedMinutes: subtask.estimatedMinutes,
      completed: false,
      energyLevel: subtask.energyLevel,
      location: subtask.location
    }));

    const newTask: Task = {
      id: Date.now().toString(),
      title: template.name,
      description: template.description,
      subtasks,
      energyLevel: template.energyLevel,
      location: template.location,
      complexity: template.complexity,
      totalEstimatedMinutes: subtasks.reduce((total, s) => total + s.estimatedMinutes, 0)
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
    setSelectedTemplate("");
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const subtasks = generateSubtasks(newTaskTitle, newTaskDescription, newTaskLocation, newTaskEnergyLevel);
    const complexity: TaskComplexity = subtasks.length > 4 ? "complex" : subtasks.length > 2 ? "moderate" : "simple";

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      subtasks,
      energyLevel: newTaskEnergyLevel,
      location: newTaskLocation,
      complexity,
      totalEstimatedMinutes: subtasks.reduce((total, s) => total + s.estimatedMinutes, 0)
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskEnergyLevel("medium");
    setNewTaskLocation("any");
    setShowForm(false);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    );
    setTasks(updatedTasks);
    onTasksChange?.(updatedTasks);
  };

  const saveAsTemplate = (task: Task) => {
    const template: TaskTemplate = {
      id: `template-${Date.now()}`,
      name: `${task.title} Template`,
      description: task.description,
      subtasks: task.subtasks.map(({ id, completed, actualMinutes, startedAt, completedAt, ...rest }) => rest),
      energyLevel: task.energyLevel,
      location: task.location,
      complexity: task.complexity
    };
    setTemplates([...templates, template]);
  };

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

  const getTotalTime = (task: Task) => {
    return task.subtasks.reduce((total, subtask) => total + subtask.estimatedMinutes, 0);
  };

  const getCompletedCount = (task: Task) => {
    return task.subtasks.filter(subtask => subtask.completed).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Breakdown
          </h2>
          <p className="text-muted-foreground">Break large tasks into manageable pieces</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-task-primary hover:bg-task-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-gradient-card">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Quick Templates</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or create custom..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTemplate && (
                <Button onClick={() => addTaskFromTemplate(selectedTemplate)} className="mt-6 bg-task-success hover:opacity-90">
                  Use Template
                </Button>
              )}
            </div>
            
            <div className="border-t pt-4">
              <Input
                placeholder="What's the main task? (e.g., Clean kitchen, Exercise, Study for exam)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="text-lg mb-4"
              />
              <Textarea
                placeholder="Any additional details about this task..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
                className="mb-4"
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Energy Level Required</label>
                  <Select value={newTaskEnergyLevel} onValueChange={(value: EnergyLevel) => setNewTaskEnergyLevel(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🌙 Low Energy</SelectItem>
                      <SelectItem value="medium">🔥 Medium Energy</SelectItem>
                      <SelectItem value="high">⚡ High Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={newTaskLocation} onValueChange={(value: TaskLocation) => setNewTaskLocation(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">🍳 Kitchen</SelectItem>
                      <SelectItem value="bathroom">🚿 Bathroom</SelectItem>
                      <SelectItem value="bedroom">🛏️ Bedroom</SelectItem>
                      <SelectItem value="living-room">🛋️ Living Room</SelectItem>
                      <SelectItem value="car">🚗 Car</SelectItem>
                      <SelectItem value="garage">🏠 Garage</SelectItem>
                      <SelectItem value="storage">📦 Storage</SelectItem>
                      <SelectItem value="office">💻 Office</SelectItem>
                      <SelectItem value="any">📍 Any Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addTask} className="bg-task-primary hover:bg-task-secondary">
                Create Task
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-6 bg-gradient-card">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-muted-foreground mt-1">{task.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <span className={getEnergyLevelColor(task.energyLevel)}>
                        {getEnergyLevelIcon(task.energyLevel)}
                      </span>
                      {task.energyLevel} energy
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {task.location}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.complexity}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveAsTemplate(task)}
                    className="text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save Template
                  </Button>
                  <Badge variant="outline" className="border-task-primary text-task-primary">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTotalTime(task)}min
                  </Badge>
                  <Badge 
                    variant={getCompletedCount(task) === task.subtasks.length ? "default" : "secondary"}
                    className={getCompletedCount(task) === task.subtasks.length ? "bg-task-success" : ""}
                  >
                    {getCompletedCount(task)}/{task.subtasks.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <button
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className="text-task-primary hover:text-task-secondary transition-colors"
                    >
                      {subtask.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                      {subtask.title}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <span className={getEnergyLevelColor(subtask.energyLevel)}>
                          {getEnergyLevelIcon(subtask.energyLevel)}
                        </span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {subtask.estimatedMinutes}min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && !showForm && (
        <Card className="p-12 text-center bg-gradient-subtle">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-task-primary/10 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-task-primary" />
            </div>
            <h3 className="text-lg font-medium">No tasks yet</h3>
            <p className="text-muted-foreground">
              Add your first task to break it down into manageable pieces
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};