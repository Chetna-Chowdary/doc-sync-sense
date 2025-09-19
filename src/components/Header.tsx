import { FileText, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  docsAnalyzed: number;
  reportsGenerated: number;
  creditsUsed: number;
}

export const Header = ({ docsAnalyzed, reportsGenerated, creditsUsed }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Smart Doc Checker</h1>
              <p className="text-sm text-muted-foreground">Find contradictions instantly</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Usage Stats:</span>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <span className="font-medium">{docsAnalyzed}</span>
              <span className="text-xs">docs analyzed</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <span className="font-medium">{reportsGenerated}</span>
              <span className="text-xs">reports generated</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="font-medium">{creditsUsed}</span>
              <span className="text-xs">credits used</span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};