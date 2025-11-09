import { useState, useEffect } from 'react';
import { RefreshCw, Flame, Award, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair"
  },
  {
    text: "Success is not how high you have climbed, but how you make a positive difference to the world.",
    author: "Roy T. Bennett"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  }
];

type StreakData = {
  currentStreak: number;
  lastVisit: string;
  longestStreak: number;
};

export function MotivationPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastVisit: '',
    longestStreak: 0,
  });

  useEffect(() => {
    // Load and update streak data
    const loadedData = loadStreakData();
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (loadedData.lastVisit === today) {
      // Already visited today, keep current streak
      setStreakData(loadedData);
    } else if (loadedData.lastVisit === yesterday) {
      // Visited yesterday, increment streak
      const newStreak = loadedData.currentStreak + 1;
      const newData = {
        currentStreak: newStreak,
        lastVisit: today,
        longestStreak: Math.max(newStreak, loadedData.longestStreak),
      };
      setStreakData(newData);
      saveStreakData(newData);
    } else {
      // Streak broken, start fresh
      const newData = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: loadedData.longestStreak,
      };
      setStreakData(newData);
      saveStreakData(newData);
    }
  }, []);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const loadStreakData = (): StreakData => {
    try {
      const saved = localStorage.getItem('motivationStreak');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading streak data:', e);
    }
    return {
      currentStreak: 0,
      lastVisit: '',
      longestStreak: 0,
    };
  };

  const saveStreakData = (data: StreakData) => {
    try {
      localStorage.setItem('motivationStreak', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving streak data:', e);
    }
  };

  const getNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const getStreakMessage = () => {
    const streak = streakData.currentStreak;
    if (streak === 0) return "Start your journey today!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "You're on fire!";
    if (streak < 100) return "Absolutely crushing it!";
    return "Legendary streak!";
  };

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="mb-8 text-center">Daily Motivation</h1>

        {/* Streak Display */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl mb-1">{streakData.currentStreak}</div>
            <div className="text-muted-foreground text-sm">Day Streak</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-2">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-3xl mb-1">{streakData.longestStreak}</div>
            <div className="text-muted-foreground text-sm">Longest Streak</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mb-1">{getStreakMessage()}</div>
            <div className="text-muted-foreground text-sm">Status</div>
          </div>
        </div>

        {/* Quote Display */}
        <div className="bg-card border border-border rounded-lg p-12 mb-6 text-center">
          <div className="text-2xl mb-6 italic">"{currentQuote.text}"</div>
          <div className="text-muted-foreground">— {currentQuote.author}</div>
        </div>

        <div className="text-center">
          <Button onClick={getNextQuote} size="lg" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            New Quote
          </Button>
        </div>
      </div>
    </div>
  );
}