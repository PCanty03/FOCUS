import { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, CheckCircle, ListTodo } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type Task = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time: string;
  description?: string;
};

type Debrief = {
  whatDone: string;
  whatNeeds: string;
  date: string;
  type: 'daily' | 'weekly';
};

type PlannerPageProps = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

export function PlannerPage({ tasks, setTasks }: PlannerPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newTask, setNewTask] = useState({ title: '', time: '', description: '' });
  
  // Mock debrief data - in real app this would come from DebriefPage
  const [todayDebrief] = useState<Debrief>({
    whatDone: 'Completed project proposal\nFinished client meeting\nReviewed code changes',
    whatNeeds: 'Schedule follow-up call\nPrepare presentation slides',
    date: new Date().toLocaleDateString(),
    type: 'daily'
  });

  const [weekDebrief] = useState<Debrief>({
    whatDone: 'Launched new feature\nCompleted 3 major tasks\nImproved team workflow',
    whatNeeds: 'Plan next sprint\nUpdate documentation\nTeam retrospective',
    date: 'This Week',
    type: 'weekly'
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days: Array<{ date: Date; isCurrentMonth: boolean; dateString: string }> = [];
    
    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, day);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: formatDateString(prevDate),
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateObj = new Date(year, month, day);
      days.push({
        date: currentDateObj,
        isCurrentMonth: true,
        dateString: formatDateString(currentDateObj),
      });
    }
    
    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: formatDateString(nextDate),
      });
    }
    
    return days;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddTask = () => {
    if (newTask.title && selectedDate) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        date: selectedDate,
        time: newTask.time,
        description: newTask.description,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', time: '', description: '' });
      setShowAddForm(false);
      setSelectedDate('');
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTasksForDate = (dateString: string) => {
    return tasks.filter((task) => task.date === dateString);
  };

  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
    setShowAddForm(true);
  };

  const monthData = getMonthData(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1>{monthName}</h1>
          <Button onClick={handleToday} variant="outline" size="sm">
            Today
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrevMonth} variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={handleNextMonth} variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Debrief Summaries */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Daily Debrief Summary */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-primary" />
            <h4>Today's Progress</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs text-primary mb-1">Completed:</div>
              <div className="text-muted-foreground line-clamp-2 whitespace-pre-line">
                {todayDebrief.whatDone || 'No updates yet'}
              </div>
            </div>
            <div>
              <div className="text-xs text-primary mb-1">Pending:</div>
              <div className="text-muted-foreground line-clamp-2 whitespace-pre-line">
                {todayDebrief.whatNeeds || 'No pending items'}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Debrief Summary */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-primary" />
            <h4>This Week's Overview</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs text-primary mb-1">Accomplished:</div>
              <div className="text-muted-foreground line-clamp-2 whitespace-pre-line">
                {weekDebrief.whatDone || 'No updates yet'}
              </div>
            </div>
            <div>
              <div className="text-xs text-primary mb-1">To Do:</div>
              <div className="text-muted-foreground line-clamp-2 whitespace-pre-line">
                {weekDebrief.whatNeeds || 'No pending items'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h3>Add Task - {selectedDate}</h3>
            <button onClick={() => { setShowAddForm(false); setSelectedDate(''); }}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block mb-1">Task Title</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block mb-1">Time (optional)</label>
              <Input
                type="time"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1">Description (optional)</label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Add details..."
                rows={3}
              />
            </div>
            <Button onClick={handleAddTask} className="w-full">
              Add Task
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden bg-card">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-3 text-center bg-muted/30"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: '1fr' }}>
          {monthData.map((day, index) => {
            const dayTasks = getTasksForDate(day.dateString);
            const today = isToday(day.date);
            
            return (
              <div
                key={index}
                className={`border-r border-b border-border p-2 overflow-auto hover:bg-accent/20 transition-colors cursor-pointer ${
                  !day.isCurrentMonth ? 'bg-muted/20' : ''
                } ${index % 7 === 6 ? 'border-r-0' : ''} ${index >= 35 ? 'border-b-0' : ''}`}
                onClick={() => handleDateClick(day.dateString)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                      today ? 'bg-primary text-primary-foreground' : ''
                    } ${!day.isCurrentMonth ? 'text-muted-foreground' : ''}`}
                  >
                    {day.date.getDate()}
                  </span>
                  {dayTasks.length > 0 && day.isCurrentMonth && (
                    <span className="text-xs text-muted-foreground">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-primary/10 border border-primary/20 px-2 py-1 rounded text-xs group relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {task.time && (
                        <div className="text-muted-foreground">{task.time}</div>
                      )}
                      <div className="line-clamp-2">{task.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
