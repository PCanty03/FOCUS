import { useState, useEffect } from 'react';
import { Plus, X, Shield, ShieldOff, AlertCircle, CheckCircle, Globe, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import useLocalStorage from '../../hooks/useLocalStorage';

interface BlockedSite {
  id: string;
  url: string;
  name?: string;
  addedAt: string;
  blockedCount: number;
}

interface BlockingSession {
  isActive: boolean;
  startTime: number | null;
  duration: number; // in minutes
}

export function WebsiteBlockerPage() {
  const [blockedSites, setBlockedSites] = useLocalStorage<BlockedSite[]>('blockedSites', []);
  const [blockingSession, setBlockingSession] = useLocalStorage<BlockingSession>('blockingSession', {
    isActive: false,
    startTime: null,
    duration: 25
  });

  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [sessionDuration, setSessionDuration] = useState(blockingSession.duration.toString());
  const [isTestingBlock, setIsTestingBlock] = useState(false);

  // Update page title when blocking is active
  useEffect(() => {
    if (blockingSession.isActive && blockingSession.startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - blockingSession.startTime!;
        const remaining = Math.max(0, (blockingSession.duration * 60 * 1000) - elapsed);
        
        if (remaining <= 0) {
          setBlockingSession({ ...blockingSession, isActive: false, startTime: null });
          document.title = 'FOCUS - Website Blocker';
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          document.title = `🚫 Focus Mode: ${minutes}:${seconds.toString().padStart(2, '0')} - FOCUS`;
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      document.title = 'FOCUS - Website Blocker';
    }
  }, [blockingSession, setBlockingSession]);

  const normalizeUrl = (url: string): string => {
    // Remove protocol and www
    return url.replace(/^https?:\/\/(www\.)?/, '').toLowerCase();
  };

  const addBlockedSite = () => {
    if (!newSiteUrl.trim()) return;

    const normalizedUrl = normalizeUrl(newSiteUrl.trim());
    
    // Check if site already exists
    const exists = blockedSites.some(site => 
      normalizeUrl(site.url) === normalizedUrl
    );

    if (exists) {
      alert('This site is already blocked!');
      return;
    }

    const newSite: BlockedSite = {
      id: Date.now().toString(),
      url: normalizedUrl,
      name: newSiteName.trim() || normalizedUrl,
      addedAt: new Date().toISOString(),
      blockedCount: 0
    };

    setBlockedSites([...blockedSites, newSite]);
    setNewSiteUrl('');
    setNewSiteName('');
  };

  const removeBlockedSite = (id: string) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
  };

  const startBlockingSession = () => {
    const duration = parseInt(sessionDuration) || 25;
    setBlockingSession({
      isActive: true,
      startTime: Date.now(),
      duration
    });

    // Show browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚫 Focus Mode Activated', {
        body: `Website blocking active for ${duration} minutes`,
        icon: '/favicon.ico'
      });
    }
  };

  const stopBlockingSession = () => {
    setBlockingSession({
      ...blockingSession,
      isActive: false,
      startTime: null
    });

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('✅ Focus Mode Ended', {
        body: 'You can now access all websites',
        icon: '/favicon.ico'
      });
    }
  };

  const testBlocking = () => {
    if (blockedSites.length === 0) {
      alert('Add some blocked sites first!');
      return;
    }

    setIsTestingBlock(true);
    const testSite = blockedSites[0];
    
    // Simulate opening a blocked site
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>🚫 Site Blocked - FOCUS</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container { 
              text-align: center; 
              padding: 2rem;
              background: rgba(255,255,255,0.1);
              border-radius: 1rem;
              backdrop-filter: blur(10px);
            }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            .message { font-size: 1.2rem; margin-bottom: 1rem; }
            .site { color: #ffeb3b; font-weight: bold; }
            .btn {
              background: #4caf50;
              color: white;
              border: none;
              padding: 0.8rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
              margin: 0.5rem;
            }
            .btn:hover { background: #45a049; }
            .btn.secondary { background: #ff9800; }
            .btn.secondary:hover { background: #f57c00; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🚫</div>
            <h1>Website Blocked</h1>
            <p class="message">
              Access to <span class="site">${testSite.name || testSite.url}</span> is currently blocked.
            </p>
            <p>Stay focused on your goals! 💪</p>
            <button class="btn" onclick="window.close()">Close Tab</button>
            <button class="btn secondary" onclick="window.opener.focus(); window.close();">Return to FOCUS</button>
          </div>
        </body>
        </html>
      `);
    }

    setTimeout(() => setIsTestingBlock(false), 2000);
  };

  const generateBookmarklet = () => {
    const bookmarkletCode = `
javascript:(function(){
  const blockedSites = JSON.parse(localStorage.getItem('blockedSites') || '[]');
  const blockingSession = JSON.parse(localStorage.getItem('blockingSession') || '{}');
  
  if (!blockingSession.isActive) {
    alert('Focus mode is not active. Activate it from the FOCUS app first.');
    return;
  }
  
  const currentUrl = window.location.hostname.replace(/^www\\./, '').toLowerCase();
  const isBlocked = blockedSites.some(site => currentUrl.includes(site.url));
  
  if (isBlocked) {
    if (confirm('🚫 This site is blocked during your focus session.\\n\\nClick OK to return to FOCUS app.')) {
      window.location.href = 'http://localhost:3000/';
    }
  } else {
    alert('✅ This site is not blocked. Keep up the focused work!');
  }
})();`.replace(/\n\s+/g, '');

    navigator.clipboard.writeText(bookmarkletCode).then(() => {
      alert('Bookmarklet copied to clipboard! Create a new bookmark and paste this as the URL.');
    });
  };

  const getRemainingTime = () => {
    if (!blockingSession.isActive || !blockingSession.startTime) return null;
    
    const elapsed = Date.now() - blockingSession.startTime;
    const remaining = Math.max(0, (blockingSession.duration * 60 * 1000) - elapsed);
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingTime = getRemainingTime();

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Website Blocker
            </h1>
            <p className="text-muted-foreground mt-2">
              Block distracting websites during focus sessions
            </p>
          </div>

          {blockingSession.isActive ? (
            <div className="text-center">
              <div className="flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400">
                <ShieldOff className="w-5 h-5" />
                Focus Mode Active
              </div>
              {remainingTime && (
                <div className="text-sm text-muted-foreground">
                  {remainingTime} remaining
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                Focus Mode Inactive
              </div>
            </div>
          )}
        </div>

        {/* Blocking Session Controls */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Focus Session
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <Input
                type="number"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                min="1"
                max="300"
                className="w-24"
                disabled={blockingSession.isActive}
              />
            </div>
            
            <div className="flex gap-2">
              {!blockingSession.isActive ? (
                <Button onClick={startBlockingSession} className="gap-2">
                  <Shield className="w-4 h-4" />
                  Start Focus Mode
                </Button>
              ) : (
                <Button onClick={stopBlockingSession} variant="destructive" className="gap-2">
                  <ShieldOff className="w-4 h-4" />
                  End Focus Mode
                </Button>
              )}
              
              <Button onClick={testBlocking} variant="outline" className="gap-2" disabled={isTestingBlock}>
                <Globe className="w-4 h-4" />
                {isTestingBlock ? 'Testing...' : 'Test Block'}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>How it works:</strong> When focus mode is active, attempting to visit blocked sites will 
              show a blocking page. Use the bookmarklet (generated below) on any website to check if it's blocked.
            </AlertDescription>
          </Alert>
        </Card>

        {/* Add New Blocked Site */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Blocked Website</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <Input
                type="text"
                value={newSiteUrl}
                onChange={(e) => setNewSiteUrl(e.target.value)}
                placeholder="youtube.com, facebook.com, reddit.com"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Display Name (optional)</label>
              <Input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                placeholder="YouTube, Social Media, etc."
                className="w-full"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={addBlockedSite} className="gap-2 w-full">
                <Plus className="w-4 h-4" />
                Add Site
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            💡 Tip: Enter just the domain (e.g., "youtube.com") without "https://" or "www"
          </p>
        </Card>

        {/* Blocked Sites List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Blocked Websites ({blockedSites.length})
          </h3>
          
          {blockedSites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No blocked websites yet.</p>
              <p className="text-sm">Add websites above to start blocking distractions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blockedSites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{site.name}</div>
                    <div className="text-sm text-muted-foreground">{site.url}</div>
                  </div>
                  
                  <Button
                    onClick={() => removeBlockedSite(site.id)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Bookmarklet */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Focus Helper Bookmarklet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate a bookmarklet that checks if the current website is blocked. 
            Drag this to your bookmarks bar and click it on any website during focus sessions.
          </p>
          
          <Button onClick={generateBookmarklet} variant="outline" className="gap-2">
            <Globe className="w-4 h-4" />
            Copy Bookmarklet
          </Button>
        </Card>

        {/* Usage Instructions */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Usage:</strong>
            <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm">
              <li>Add websites you want to block above</li>
              <li>Start a focus session with your desired duration</li>
              <li>Copy and create the bookmarklet bookmark</li>
              <li>When browsing, click the bookmarklet to check if a site should be blocked</li>
              <li>Blocked sites will redirect you back to the FOCUS app</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}