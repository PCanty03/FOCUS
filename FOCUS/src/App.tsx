import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PlannerPage } from './components/pages/PlannerPage';
import { TasksPage } from './components/pages/TasksPage';
import { TimerPage } from './components/pages/TimerPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { MotivationPage } from './components/pages/MotivationPage';
import { DebriefPage } from './components/pages/DebriefPage';
import { SettingsPage } from './components/pages/SettingsPage';
import useLocalStorage from './hooks/useLocalStorage';

type PageType = 'planner' | 'tasks' | 'timer' | 'courses' | 'motivation' | 'debrief' | 'settings';

// Shared task types
export type PlannerTask = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time: string;
  description?: string;
};

export type GeneralTask = {
  id: string;
  name: string;
  description: string;
  status: 'not-done' | 'done';
};

export default function App() {
  const [activePage, setActivePage] = useState<PageType>('planner');
  
  // Shared state for tasks with localStorage persistence
  const [plannerTasks, setPlannerTasks] = useLocalStorage<PlannerTask[]>('plannerTasks', []);
  const [generalTasks, setGeneralTasks] = useLocalStorage<GeneralTask[]>('generalTasks', []);

  const renderPage = () => {
    switch (activePage) {
      case 'planner':
        return (
          <PlannerPage
            tasks={plannerTasks}
            setTasks={setPlannerTasks}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            tasks={generalTasks}
            setTasks={setGeneralTasks}
          />
        );
      case 'timer':
        return <TimerPage />;
      case 'courses':
        return <CoursesPage />;
      case 'motivation':
        return <MotivationPage />;
      case 'debrief':
        return <DebriefPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <PlannerPage
            tasks={plannerTasks}
            setTasks={setPlannerTasks}
          />
        );
    }
  };

  return (
    <div className="size-full flex">
      <Sidebar activePage={activePage} onNavigate={(page) => setActivePage(page as PageType)} />
      <main className="flex-1 overflow-auto bg-background">
        {renderPage()}
      </main>
    </div>
  );
}