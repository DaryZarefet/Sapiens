import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex bg-primary items-center justify-center h-screen">
      <Loader2 size={64} className="animate-spin text-blue-600" />
    </div>
  );
}

export function Spinner() {
  return <Loader2 size={16} className="animate-spin text-blue-600" />;
}
