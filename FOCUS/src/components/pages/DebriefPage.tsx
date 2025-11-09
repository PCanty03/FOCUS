import { useState } from 'react';
import { Save, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type Debrief = {
  id: string;
  date: string;
  whatDone: string;
  whatNeeds: string;
  type: 'daily' | 'weekly';
};

export function DebriefPage() {
  const [debriefs, setDebriefs] = useState<Debrief[]>([]);
  const [currentDaily, setCurrentDaily] = useState({ whatDone: '', whatNeeds: '' });
  const [currentWeekly, setCurrentWeekly] = useState({ whatDone: '', whatNeeds: '' });

  const handleSaveDaily = () => {
    if (currentDaily.whatDone.trim() || currentDaily.whatNeeds.trim()) {
      const debrief: Debrief = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        whatDone: currentDaily.whatDone,
        whatNeeds: currentDaily.whatNeeds,
        type: 'daily',
      };
      setDebriefs([debrief, ...debriefs]);
      setCurrentDaily({ whatDone: '', whatNeeds: '' });
    }
  };

  const handleSaveWeekly = () => {
    if (currentWeekly.whatDone.trim() || currentWeekly.whatNeeds.trim()) {
      const startOfWeek = new Date();
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      const weekStart = new Date(startOfWeek.setDate(diff));
      
      const debrief: Debrief = {
        id: Date.now().toString(),
        date: `Week of ${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        whatDone: currentWeekly.whatDone,
        whatNeeds: currentWeekly.whatNeeds,
        type: 'weekly',
      };
      setDebriefs([debrief, ...debriefs]);
      setCurrentWeekly({ whatDone: '', whatNeeds: '' });
    }
  };

  const dailyDebriefs = debriefs.filter(d => d.type === 'daily');
  const weeklyDebriefs = debriefs.filter(d => d.type === 'weekly');

  return (
    <div className="h-full p-6">
      <h1 className="mb-6">Debrief</h1>

      <div className="max-w-4xl">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="daily">Daily Debrief</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Debrief</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3>Today's Debrief</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">What I've Done Today</label>
                  <Textarea
                    value={currentDaily.whatDone}
                    onChange={(e) => setCurrentDaily({ ...currentDaily, whatDone: e.target.value })}
                    placeholder="List your accomplishments, completed tasks, and achievements..."
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block mb-2">What Needs to be Done</label>
                  <Textarea
                    value={currentDaily.whatNeeds}
                    onChange={(e) => setCurrentDaily({ ...currentDaily, whatNeeds: e.target.value })}
                    placeholder="List pending tasks, priorities for tomorrow, and next steps..."
                    rows={5}
                  />
                </div>

                <Button onClick={handleSaveDaily} className="gap-2 w-full">
                  <Save className="w-4 h-4" />
                  Save Daily Debrief
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3>Previous Daily Debriefs</h3>
              {dailyDebriefs.map((debrief) => (
                <div key={debrief.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm mb-3">{debrief.date}</div>
                  <div className="space-y-3">
                    {debrief.whatDone && (
                      <div>
                        <div className="text-sm text-primary mb-1">What I've Done:</div>
                        <div className="whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded">{debrief.whatDone}</div>
                      </div>
                    )}
                    {debrief.whatNeeds && (
                      <div>
                        <div className="text-sm text-primary mb-1">What Needs to be Done:</div>
                        <div className="whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded">{debrief.whatNeeds}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {dailyDebriefs.length === 0 && (
                <div className="text-center text-muted-foreground py-12 bg-muted/20 rounded-lg">
                  No daily debriefs yet. Start your first debrief above!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3>This Week's Debrief</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">What I've Done This Week</label>
                  <Textarea
                    value={currentWeekly.whatDone}
                    onChange={(e) => setCurrentWeekly({ ...currentWeekly, whatDone: e.target.value })}
                    placeholder="Reflect on this week's accomplishments, milestones, and progress..."
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block mb-2">What Needs to be Done</label>
                  <Textarea
                    value={currentWeekly.whatNeeds}
                    onChange={(e) => setCurrentWeekly({ ...currentWeekly, whatNeeds: e.target.value })}
                    placeholder="Plan for next week, pending goals, and priorities..."
                    rows={6}
                  />
                </div>

                <Button onClick={handleSaveWeekly} className="gap-2 w-full">
                  <Save className="w-4 h-4" />
                  Save Weekly Debrief
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3>Previous Weekly Debriefs</h3>
              {weeklyDebriefs.map((debrief) => (
                <div key={debrief.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm mb-3">{debrief.date}</div>
                  <div className="space-y-3">
                    {debrief.whatDone && (
                      <div>
                        <div className="text-sm text-primary mb-1">What I've Done:</div>
                        <div className="whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded">{debrief.whatDone}</div>
                      </div>
                    )}
                    {debrief.whatNeeds && (
                      <div>
                        <div className="text-sm text-primary mb-1">What Needs to be Done:</div>
                        <div className="whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded">{debrief.whatNeeds}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {weeklyDebriefs.length === 0 && (
                <div className="text-center text-muted-foreground py-12 bg-muted/20 rounded-lg">
                  No weekly debriefs yet. Start your first debrief above!
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
