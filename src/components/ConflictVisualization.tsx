import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Conflict {
  id: string;
  type: 'critical' | 'warning' | 'info';
  doc1Text: string;
  doc2Text: string;
  doc1Name: string;
  doc2Name: string;
  explanation: string;
  suggestedFix: string;
}

interface ConflictVisualizationProps {
  conflicts: Conflict[];
  onExportReport: () => void;
}

export const ConflictVisualization = ({ conflicts, onExportReport }: ConflictVisualizationProps) => {
  const getSeverityIcon = (type: Conflict['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-critical" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getSeverityBadge = (type: Conflict['type']) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const criticalConflicts = conflicts.filter(c => c.type === 'critical');
  const warningConflicts = conflicts.filter(c => c.type === 'warning');
  const infoConflicts = conflicts.filter(c => c.type === 'info');

  if (conflicts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-success/10 p-4 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Conflicts Found</h3>
          <p className="text-muted-foreground">
            Great! Your documents appear to be consistent with each other.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conflict Summary</CardTitle>
            <Button onClick={onExportReport} variant="outline">
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-critical">{criticalConflicts.length}</div>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{warningConflicts.length}</div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{infoConflicts.length}</div>
              <p className="text-sm text-muted-foreground">Info</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-semibold">Priority Actions</h4>
            {criticalConflicts.slice(0, 3).map((conflict) => (
              <div key={conflict.id} className="flex items-start gap-3 p-3 bg-critical/5 rounded-lg border border-critical/20">
                {getSeverityIcon(conflict.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{conflict.explanation}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conflict.doc1Name} vs {conflict.doc2Name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Conflicts */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {getSeverityBadge(conflict.type)}
                  <span className="text-xs text-muted-foreground">
                    {conflict.doc1Name} • {conflict.doc2Name}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="p-2 bg-muted rounded text-sm">
                    <span className="font-medium text-critical">Document 1:</span> {conflict.doc1Text}
                  </div>
                  <div className="p-2 bg-muted rounded text-sm">
                    <span className="font-medium text-critical">Document 2:</span> {conflict.doc2Text}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-sm">Issue:</span>
                    <p className="text-sm text-muted-foreground">{conflict.explanation}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Suggested Fix:</span>
                    <p className="text-sm text-success">{conflict.suggestedFix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};