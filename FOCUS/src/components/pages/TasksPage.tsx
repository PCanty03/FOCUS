import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type Task = {
  id: string;
  name: string;
  description: string;
  status: 'not-done' | 'done';
};

type TasksPageProps = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export function TasksPage({ tasks, setTasks }: TasksPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ name: '', description: '' });

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.name,
        description: newTask.description,
        status: 'not-done',
      };
      setTasks([...tasks, task]);
      setNewTask({ name: '', description: '' });
      setShowAddForm(false);
    }
  };

  const updateTaskStatus = (id: string, status: 'done' | 'not-done') => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskExpansion = (id: string) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1>Tasks</h1>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <div className="max-w-3xl">
        {showAddForm && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Create New Task</h3>
              <button onClick={() => setShowAddForm(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1">Task Name</label>
                <Input
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add task description..."
                  rows={4}
                />
              </div>
              <Button onClick={handleAddTask} className="w-full">
                Create Task
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                className="bg-card border border-border rounded-lg overflow-hidden transition-all"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => toggleTaskExpansion(task.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <span className={isDone ? 'line-through text-muted-foreground' : ''}>
                        {task.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTaskStatus(task.id, 'done');
                        }}
                        size="sm"
                        variant={isDone ? 'default' : 'outline'}
                        className={isDone ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        Done
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTaskStatus(task.id, 'not-done');
                        }}
                        size="sm"
                        variant={!isDone ? 'default' : 'outline'}
                        className={!isDone ? 'bg-amber-600 hover:bg-amber-700' : ''}
                      >
                        Not Done
                      </Button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="text-destructive hover:opacity-70 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && task.description && (
                  <div className="px-4 pb-4 border-t border-border pt-4 bg-muted/30">
                    <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                  </div>
                )}
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No tasks yet. Click "Add Task" to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}