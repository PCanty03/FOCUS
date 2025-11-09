import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function TimerPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
            setTotalSeconds(totalSeconds - 1);
          }
        } else {
          setSeconds(seconds - 1);
          setTotalSeconds(totalSeconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds, totalSeconds]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const mins = parseInt(customMinutes) || 25;
    setMinutes(mins);
    setSeconds(0);
    const total = mins * 60;
    setTotalSeconds(total);
    setInitialSeconds(total);
  };

  const handleSetCustomTime = () => {
    const mins = parseInt(customMinutes) || 25;
    setMinutes(mins);
    setSeconds(0);
    setIsRunning(false);
    const total = mins * 60;
    setTotalSeconds(total);
    setInitialSeconds(total);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate progress percentage for hourglass animation
  const progress = initialSeconds > 0 ? (totalSeconds / initialSeconds) * 100 : 100;
  const topSandHeight = progress;
  const bottomSandHeight = 100 - progress;

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="mb-8 text-center">Pomodoro Timer</h1>

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
              {isRunning && topSandHeight > 0 && (
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
                {!isRunning ? (
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
                  {isRunning ? 'Timer Running' : 'Ready to Start'}
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
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  min="1"
                  max="120"
                  className="flex-1"
                />
                <Button onClick={handleSetCustomTime}>Set</Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setCustomMinutes('5');
                    const mins = 5;
                    setMinutes(mins);
                    setSeconds(0);
                    setIsRunning(false);
                    const total = mins * 60;
                    setTotalSeconds(total);
                    setInitialSeconds(total);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  5 min
                </Button>
                <Button
                  onClick={() => {
                    setCustomMinutes('15');
                    const mins = 15;
                    setMinutes(mins);
                    setSeconds(0);
                    setIsRunning(false);
                    const total = mins * 60;
                    setTotalSeconds(total);
                    setInitialSeconds(total);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  15 min
                </Button>
                <Button
                  onClick={() => {
                    setCustomMinutes('25');
                    const mins = 25;
                    setMinutes(mins);
                    setSeconds(0);
                    setIsRunning(false);
                    const total = mins * 60;
                    setTotalSeconds(total);
                    setInitialSeconds(total);
                  }}
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
      </div>
    </div>
  );
}