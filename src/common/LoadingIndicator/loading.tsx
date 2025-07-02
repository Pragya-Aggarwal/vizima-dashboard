import { Loader2 } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm">Loading...</span>
    </div>
  );
};

export default LoadingIndicator;
