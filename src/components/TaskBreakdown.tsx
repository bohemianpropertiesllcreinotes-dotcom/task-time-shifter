import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Clock, 
  MapPin, 
  Zap, 
  CheckCircle2, 
  Circle,
  Trash2,
  Edit3,
  RotateCcw,
  File,
  Save
} from "lucide-react";
import { Task, Subtask, EnergyLevel, TaskLocation, TaskComplexity } from "@/types/scheduler";
import { TASK_TEMPLATES, getTaskTemplate } from "@/data/taskTemplates";

interface TaskBreakdownProps {
  tasks?: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export const TaskBreakdown = ({ tasks: propTasks = [], onTasksChange }: TaskBreakdownProps) => {
  const [tasks, setTasks] = useState<Task[]>(propTasks);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    energyLevel: "medium" as EnergyLevel,
    location: "any" as TaskLocation,
    complexity: "simple" as TaskComplexity
  });

  // Update tasks when propTasks changes
  useEffect(() => {
    setTasks(propTasks);
  }, [propTasks]);

  const generateSubtasks = (title: string, complexity: TaskComplexity, location: TaskLocation): Subtask[] => {
    const taskLower = title.toLowerCase();
    let subtasks: Subtask[] = [];

    // Check for existing templates first
    if (taskLower.includes("clean kitchen")) {
      const template = getTaskTemplate("clean-kitchen");
      if (template) {
        return template.subtasks.map((subtask, index) => ({
          ...subtask,
          id: `${Date.now()}-${index}`,
          completed: false
        }));
      }
    }

    // Generic breakdown based on complexity
    const baseSubtasks = [
      { title: "Plan and prepare", minutes: 10, energy: "medium" as EnergyLevel },
      { title: "Start main work", minutes: 20, energy: "high" as EnergyLevel },
      { title: "Complete and review", minutes: 10, energy: "low" as EnergyLevel },
    ];

    if (complexity === "complex") {
      baseSubtasks.splice(1, 1, 
        { title: "First phase", minutes: 25, energy: "high" as EnergyLevel },
        { title: "Second phase", minutes: 30, energy: "medium" as EnergyLevel },
        { title: "Final phase", minutes: 15, energy: "low" as EnergyLevel }
      );
    } else if (complexity === "moderate") {
      baseSubtasks[1] = { title: "Main work phase", minutes: 30, energy: "medium" as EnergyLevel };
    }

    return baseSubtasks.map((subtask, index) => ({
      id: `${Date.now()}-${index}`,
      title: subtask.title,
      estimatedMinutes: subtask.minutes,
      completed: false,
      energyLevel: subtask.energy,
      location: location
    }));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const subtasks: Subtask[] = generateSubtasks(newTask.title, newTask.complexity, newTask.location);
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      subtasks,
      energyLevel: newTask.energyLevel,
      location: newTask.location,
      complexity: newTask.complexity,
      totalEstimatedMinutes: subtasks.reduce((total, sub) => total + sub.estimatedMinutes, 0),
      isRecurring: false,
      streak: 0,
      template: false
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
    setNewTask({
      title: "",
      description: "",
      energyLevel: "medium",
      location: "any",
      complexity: "simple"
    });
    setShowForm(false);
  };

  const addTaskFromTemplate = (templateId: string) => {
    const template = getTaskTemplate(templateId);
    if (!template) return;

    const subtasks: Subtask[] = template.subtasks.map((subtask, index) => ({
      ...subtask,
      id: `${Date.now()}-${index}`,
      completed: false
    }));

    const task: Task = {
      id: Date.now().toString(),
      title: template.name,
      description: template.description,
      subtasks,
      energyLevel: template.energyLevel,
      location: template.location,        
      complexity: template.complexity,
      totalEstimatedMinutes: subtasks.reduce((total, sub) => total + sub.estimatedMinutes, 0),
      isRecurring: false,
      streak: 0,
      template: true
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
    setShowTemplates(false);
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
    onTasksChange(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    onTasksChange(updatedTasks);
  };

  const getEnergyLevelColor = (level: EnergyLevel) => {
    switch (level) {
      case "high": return "text-task-warning";
      case "medium": return "text-task-secondary";
      case "low": return "text-task-success";
    }
  };

  const getEnergyLevelIcon = (level: EnergyLevel) => {
    switch (level) {
      case "high": return "⚡";
      case "medium": return "🔥";
      case "low": return "🌙";
    }
  };

  const getCompletedCount = (task: Task) => {
    return task.subtasks.filter(subtask => subtask.completed).length;
  };

  const getProgressPercentage = (task: Task) => {
    const completed = getCompletedCount(task);
    return Math.round((completed / task.subtasks.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Breakdown
          </h2>
          <p className="text-muted-foreground">
            Break down large tasks into manageable subtasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowTemplates(!showTemplates)}
            variant="outline"
            className="border-task-primary text-task-primary hover:bg-task-primary hover:text-white"
          >
            <File className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-task-primary hover:bg-task-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {showTemplates && (
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold mb-4">Choose from Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {TASK_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:border-task-primary transition-colors cursor-pointer bg-background/50"
                onClick={() => addTaskFromTemplate(template.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="outline">{template.location}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="text-xs">
                    <span className={getEnergyLevelColor(template.energyLevel)}>
                      {getEnergyLevelIcon(template.energyLevel)}
                    </span>
                    {template.energyLevel}
                  </Badge>
                  <Badge variant="secondary">{template.complexity}</Badge>
                  <span className="text-muted-foreground">{template.subtasks.length} steps</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setShowTemplates(false)}>
            Cancel
          </Button>
        </Card>
      )}

      {showForm && (
        <Card className="p-6 bg-gradient-card">
          <div className="space-y-4">
            <Input
              placeholder="Task title (e.g., Clean kitchen, Study for exam)"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Task description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Energy Level</label>
                <select
                  value={newTask.energyLevel}
                  onChange={(e) => setNewTask({ ...newTask, energyLevel: e.target.value as EnergyLevel })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="low">🌙 Low Energy</option>
                  <option value="medium">🔥 Medium Energy</option>
                  <option value="high">⚡ High Energy</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <select
                  value={newTask.location}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value as TaskLocation })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="any">Any Location</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="bedroom">Bedroom</option>
                  <option value="living-room">Living Room</option>
                  <option value="car">Car</option>
                  <option value="garage">Garage</option>
                  <option value="storage">Storage</option>
                  <option value="office">Office</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Complexity</label>
                <select
                  value={newTask.complexity}
                  onChange={(e) => setNewTask({ ...newTask, complexity: e.target.value as TaskComplexity })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="complex">Complex</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addTask} className="bg-task-primary hover:bg-task-secondary">
                Add Task
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
                  <Badge variant="outline" className="border-task-primary text-task-primary">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.totalEstimatedMinutes}min
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Progress: {getCompletedCount(task)}/{task.subtasks.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getProgressPercentage(task)}%
                  </span>
                </div>
                <Progress value={getProgressPercentage(task)} className="h-2" />
              </div>

              <Separator />

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
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                        {subtask.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-task-primary hover:bg-task-secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Task
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};