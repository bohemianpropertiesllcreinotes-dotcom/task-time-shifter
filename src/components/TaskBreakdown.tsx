import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, CheckCircle, Circle } from "lucide-react";

interface Subtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
}

export const TaskBreakdown = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const generateSubtasks = (title: string, description: string): Subtask[] => {
    // Smart subtask generation based on common task patterns
    const taskLower = title.toLowerCase();
    let subtasks: Subtask[] = [];

    if (taskLower.includes("clean kitchen")) {
      subtasks = [
        { id: "1", title: "Clear and wipe counters", estimatedMinutes: 10, completed: false },
        { id: "2", title: "Load/run dishwasher", estimatedMinutes: 5, completed: false },
        { id: "3", title: "Clean stovetop", estimatedMinutes: 10, completed: false },
        { id: "4", title: "Sweep and mop floor", estimatedMinutes: 15, completed: false },
      ];
    } else if (taskLower.includes("exercise") || taskLower.includes("workout")) {
      subtasks = [
        { id: "1", title: "Change into workout clothes", estimatedMinutes: 5, completed: false },
        { id: "2", title: "5-minute warm-up", estimatedMinutes: 5, completed: false },
        { id: "3", title: "Main workout routine", estimatedMinutes: 25, completed: false },
        { id: "4", title: "Cool down and stretch", estimatedMinutes: 10, completed: false },
      ];
    } else if (taskLower.includes("study") || taskLower.includes("learn")) {
      subtasks = [
        { id: "1", title: "Review previous material", estimatedMinutes: 10, completed: false },
        { id: "2", title: "Read new chapter/material", estimatedMinutes: 20, completed: false },
        { id: "3", title: "Take notes on key points", estimatedMinutes: 15, completed: false },
        { id: "4", title: "Practice problems/review", estimatedMinutes: 15, completed: false },
      ];
    } else {
      // Generic breakdown
      subtasks = [
        { id: "1", title: "Plan and prepare", estimatedMinutes: 10, completed: false },
        { id: "2", title: "Start main work", estimatedMinutes: 20, completed: false },
        { id: "3", title: "Complete and review", estimatedMinutes: 10, completed: false },
      ];
    }

    return subtasks;
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      subtasks: generateSubtasks(newTaskTitle, newTaskDescription),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setShowForm(false);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => 
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
    ));
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
            <Input
              placeholder="What's the main task? (e.g., Clean kitchen, Exercise, Study for exam)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="text-lg"
            />
            <Textarea
              placeholder="Any additional details about this task..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              rows={3}
            />
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
                <div>
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
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
                    <span className="ml-auto text-sm text-muted-foreground">
                      {subtask.estimatedMinutes}min
                    </span>
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