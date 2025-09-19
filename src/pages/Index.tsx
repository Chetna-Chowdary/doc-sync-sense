import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { DocumentUpload } from '@/components/DocumentUpload';
import { ConflictVisualization } from '@/components/ConflictVisualization';
import { LiveMonitoring } from '@/components/LiveMonitoring';
import { Zap, FileSearch, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
}

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

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [docsAnalyzed, setDocsAnalyzed] = useState(12);
  const [reportsGenerated, setReportsGenerated] = useState(8);
  const [creditsUsed, setCreditsUsed] = useState(47);

  // Mock conflicts data for demo
  const mockConflicts: Conflict[] = [
    {
      id: '1',
      type: 'critical',
      doc1Text: 'Submission deadline is 10:00 PM',
      doc2Text: 'All assignments must be submitted before midnight',
      doc1Name: 'Project Guidelines.pdf',
      doc2Name: 'Course Rules.docx',
      explanation: 'Contradictory deadline times between project guidelines and course rules',
      suggestedFix: 'Standardize to a single deadline time across all documents, preferably 11:59 PM'
    },
    {
      id: '2',
      type: 'warning',
      doc1Text: 'Minimum attendance requirement: 75%',
      doc2Text: 'Students need at least 65% attendance',
      doc1Name: 'Academic Handbook.pdf',
      doc2Name: 'College Circular.txt',
      explanation: 'Different attendance requirements stated in academic documents',
      suggestedFix: 'Clarify the official attendance requirement and update all documents accordingly'
    },
    {
      id: '3',
      type: 'info',
      doc1Text: 'Office hours: Monday to Friday 9 AM - 5 PM',
      doc2Text: 'Available for consultation during working hours',
      doc1Name: 'Faculty Info.pdf',
      doc2Name: 'Contact Details.docx',
      explanation: 'Second document lacks specific timing details',
      suggestedFix: 'Add specific office hours to the contact details document'
    }
  ];

  const handleAnalyzeDocuments = async () => {
    if (uploadedFiles.filter(f => f.status === 'uploaded').length < 2) {
      toast({
        title: "Insufficient documents",
        description: "Please upload at least 2 documents to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setConflicts(mockConflicts);
    setHasAnalyzed(true);
    setIsAnalyzing(false);
    setDocsAnalyzed(prev => prev + uploadedFiles.length);
    setCreditsUsed(prev => prev + uploadedFiles.length * 2);
    
    toast({
      title: "Analysis complete",
      description: `Found ${mockConflicts.length} potential conflicts`,
    });
  };

  const handleExportReport = () => {
    // Simulate report generation
    toast({
      title: "Report exported",
      description: "Your conflict analysis report has been generated",
    });
    setReportsGenerated(prev => prev + 1);
    setCreditsUsed(prev => prev + 5);
  };

  const handleNewConflicts = (newCount: number) => {
    toast({
      title: "New conflicts detected",
      description: `${newCount} new conflict(s) found in monitored documents`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        docsAnalyzed={docsAnalyzed}
        reportsGenerated={reportsGenerated}
        creditsUsed={creditsUsed}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Document Upload</TabsTrigger>
            <TabsTrigger value="analysis">Conflict Analysis</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  Smart Document Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DocumentUpload onFilesChange={setUploadedFiles} />
                
                <div className="flex items-center justify-center">
                  <Button
                    onClick={handleAnalyzeDocuments}
                    disabled={isAnalyzing || uploadedFiles.filter(f => f.status === 'uploaded').length < 2}
                    size="lg"
                    className="min-w-48"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze Documents
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {hasAnalyzed ? (
              <ConflictVisualization 
                conflicts={conflicts}
                onExportReport={handleExportReport}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload and analyze documents to view conflicts here.
                  </p>
                  <Button onClick={() => (document.querySelector('[data-state="active"][value="upload"]') as HTMLElement)?.click()}>
                    Go to Upload
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <LiveMonitoring onNewConflicts={handleNewConflicts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
