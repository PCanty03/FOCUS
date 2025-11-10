import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import useLocalStorage from '../../hooks/useLocalStorage';

interface TimerState {
  isRunning: boolean;
  totalSeconds: number;
  initialSeconds: number;
  startTime: number | null;
  endTime: number | null;
  customMinutes: string;
}

export function TimerPage() {
  const [timerState, setTimerState] = useLocalStorage<TimerState>('timerState', {
    isRunning: false,
    totalSeconds: 25 * 60,
    initialSeconds: 25 * 60,
    startTime: null,
    endTime: null,
    customMinutes: '25'
  });

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notificationsEnabled', false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalTitle = useRef(document.title);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        setNotificationsEnabled(permission === 'granted');
      });
    } else if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, [setNotificationsEnabled]);

  // Calculate current time remaining based on start time and elapsed time
  const calculateTimeRemaining = () => {
    if (!timerState.isRunning || !timerState.startTime) {
      return timerState.totalSeconds;
    }

    const now = Date.now();
    const elapsed = Math.floor((now - timerState.startTime) / 1000);
    const remaining = Math.max(0, timerState.totalSeconds - elapsed);
    
    return remaining;
  };

  // Update display every second
  useEffect(() => {
    const updateDisplay = () => {
      const remaining = calculateTimeRemaining();
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      
      setMinutes(mins);
      setSeconds(secs);

      // Update page title to show timer
      if (timerState.isRunning) {
        document.title = `⏰ ${formatTime(mins, secs)} - ${originalTitle.current}`;
      } else {
        document.title = originalTitle.current;
      }

      // Check if timer finished
      if (timerState.isRunning && remaining === 0) {
        handleTimerComplete();
      }
    };

    // Update immediately
    updateDisplay();

    // Set up interval to update every second
    const interval = setInterval(updateDisplay, 1000);

    return () => {
      clearInterval(interval);
      // Restore original title when component unmounts
      document.title = originalTitle.current;
    };
  }, [timerState]);

  const showNotification = (title: string, body: string) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'timer',
        requireInteraction: true
      });

      // Auto-close notification after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
  };

  const handleTimerComplete = () => {
    setTimerState({
      ...timerState,
      isRunning: false,
      startTime: null,
      endTime: Date.now()
    });

    showNotification('🎉 Timer Complete!', 'Your pomodoro session has finished. Time for a break!');
    
    // Play a sound if possible (optional)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmzhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuZ3fLKeiQFNH/N8tyOOQc=');
      audio.play().catch(() => {
        // Audio play failed, ignore silently
      });
    } catch (e) {
      // Audio not supported, ignore
    }
  };

  const handleStart = () => {
    const now = Date.now();
    setTimerState({
      ...timerState,
      isRunning: true,
      startTime: now,
      endTime: null
    });

    showNotification('⏱️ Timer Started', `${Math.floor(timerState.totalSeconds / 60)} minute timer has begun!`);
  };

  const handlePause = () => {
    const remaining = calculateTimeRemaining();
    setTimerState({
      ...timerState,
      isRunning: false,
      startTime: null,
      totalSeconds: remaining
    });

    showNotification('⏸️ Timer Paused', `Timer paused with ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')} remaining`);
  };

  const handleReset = () => {
    const mins = parseInt(timerState.customMinutes) || 25;
    const total = mins * 60;
    
    setTimerState({
      ...timerState,
      isRunning: false,
      totalSeconds: total,
      initialSeconds: total,
      startTime: null,
      endTime: null
    });

    document.title = originalTitle.current;
  };

  const handleSetCustomTime = () => {
    const mins = parseInt(timerState.customMinutes) || 25;
    const total = mins * 60;
    
    setTimerState({
      ...timerState,
      isRunning: false,
      totalSeconds: total,
      initialSeconds: total,
      startTime: null,
      endTime: null
    });
  };

  const setCustomMinutes = (value: string) => {
    setTimerState({
      ...timerState,
      customMinutes: value
    });
  };

  const setPresetTime = (mins: number) => {
    const total = mins * 60;
    setTimerState({
      ...timerState,
      customMinutes: mins.toString(),
      isRunning: false,
      totalSeconds: total,
      initialSeconds: total,
      startTime: null,
      endTime: null
    });
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate progress percentage for hourglass animation
  const currentRemaining = calculateTimeRemaining();
  const progress = timerState.initialSeconds > 0 ? (currentRemaining / timerState.initialSeconds) * 100 : 100;
  const topSandHeight = progress;
  const bottomSandHeight = 100 - progress;

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-8">
          <h1>Pomodoro Timer</h1>
          <Button
            onClick={toggleNotifications}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-12 mb-8">
          {/* Hourglass Visual */}
          <div className="relative">
            <svg
              width="200"
              height="300"
              viewBox="0 0 200 300"
              className="drop-shadow-lg"
            >
              {/* Hourglass outline */}
              <path
                d="M 40 20 L 160 20 L 160 80 L 100 150 L 160 220 L 160 280 L 40 280 L 40 220 L 100 150 L 40 80 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-foreground"
              />
              
              {/* Top frame */}
              <rect x="30" y="10" width="140" height="15" rx="3" fill="currentColor" className="text-foreground" />
              
              {/* Bottom frame */}
              <rect x="30" y="275" width="140" height="15" rx="3" fill="currentColor" className="text-foreground" />
              
              {/* Top sand container (clips the sand) */}
              <defs>
                <clipPath id="topSandClip">
                  <path d="M 40 20 L 160 20 L 160 80 L 100 150 Z" />
                </clipPath>
                <clipPath id="bottomSandClip">
                  <path d="M 100 150 L 160 220 L 160 280 L 40 280 L 40 220 Z" />
                </clipPath>
              </defs>
              
              {/* Top sand (empties as time goes) */}
              <g clipPath="url(#topSandClip)">
                <rect
                  x="40"
                  y={20 + (130 * (1 - topSandHeight / 100))}
                  width="120"
                  height={130 * (topSandHeight / 100)}
                  fill="#f59e0b"
                  className="transition-all duration-1000"
                />
              </g>
              
              {/* Bottom sand (fills as time goes) */}
              <g clipPath="url(#bottomSandClip)">
                <rect
                  x="40"
                  y={280 - (130 * (bottomSandHeight / 100))}
                  width="120"
                  height={130 * (bottomSandHeight / 100)}
                  fill="#f59e0b"
                  className="transition-all duration-1000"
                />
              </g>
              
              {/* Falling sand stream animation when running */}
              {timerState.isRunning && topSandHeight > 0 && (
                <>
                  <line
                    x1="100"
                    y1="145"
                    x2="100"
                    y2="155"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <circle cx="100" cy="145" r="1.5" fill="#f59e0b" className="animate-pulse" />
                </>
              )}
            </svg>
            
            {/* Timer display overlaid on hourglass */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-border">
                <div className="text-4xl tabular-nums">{formatTime(minutes, seconds)}</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex gap-3 mb-4">
                {!timerState.isRunning ? (
                  <Button onClick={handleStart} size="lg" className="gap-2 flex-1">
                    <Play className="w-5 h-5" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2 flex-1">
                    <Pause className="w-5 h-5" />
                    Pause
                  </Button>
                )}
                <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="text-center text-sm text-muted-foreground mb-2">
                  {timerState.isRunning ? 'Timer Running' : 'Ready to Start'}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${100 - progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <label className="block mb-3">Set Custom Time (minutes)</label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="number"
                  value={timerState.customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  min="1"
                  max="120"
                  className="flex-1"
                />
                <Button onClick={handleSetCustomTime}>Set</Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPresetTime(5)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  5 min
                </Button>
                <Button
                  onClick={() => setPresetTime(15)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  15 min
                </Button>
                <Button
                  onClick={() => setPresetTime(25)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  25 min
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        {timerState.isRunning && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Timer is running in the background - you'll get notified when it completes!</p>
            <p className="mt-1">Close this tab or minimize the browser - the timer will continue.</p>
          </div>
        )}
      </div>
    </div>
  );
}