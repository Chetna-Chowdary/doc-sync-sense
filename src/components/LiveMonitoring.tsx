import { useState } from 'react';
import { Monitor, Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface MonitoredSource {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'checking';
  lastChecked: string;
  newConflicts: number;
}

interface LiveMonitoringProps {
  onNewConflicts: (conflicts: number) => void;
}

export const LiveMonitoring = ({ onNewConflicts }: LiveMonitoringProps) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sources] = useState<MonitoredSource[]>([
    {
      id: '1',
      name: 'College Rules Document',
      url: 'college_rules.txt',
      status: 'connected',
      lastChecked: '2 minutes ago',
      newConflicts: 0,
    },
    {
      id: '2',
      name: 'HR Policy Handbook',
      url: 'hr_policies.pdf',
      status: 'disconnected',
      lastChecked: '1 hour ago',
      newConflicts: 2,
    },
  ]);

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Simulate new conflicts being found
      setTimeout(() => {
        onNewConflicts(1);
      }, 5000);
    }
  };

  const getStatusIcon = (status: MonitoredSource['status']) => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-success" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-muted-foreground" />;
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />;
    }
  };

  const getStatusBadge = (status: MonitoredSource['status']) => {
    switch (status) {
      case 'connected':
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <CardTitle>Live Monitoring</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isMonitoring ? 'Active' : 'Inactive'}
            </span>
            <Switch
              checked={isMonitoring}
              onCheckedChange={handleToggleMonitoring}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Monitor external documents for updates and automatically detect new conflicts with your uploaded files.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Monitored Sources</h4>
          {sources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(source.status)}
                <div>
                  <p className="font-medium text-sm">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.url}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {source.newConflicts > 0 && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {source.newConflicts} new conflicts
                  </Badge>
                )}
                {getStatusBadge(source.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last check: {sources[0]?.lastChecked}</span>
        </div>

        {isMonitoring && (
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="animate-pulse rounded-full h-2 w-2 bg-primary" />
              <span className="text-sm font-medium text-primary">
                Monitoring active - checking for updates every 5 minutes
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};