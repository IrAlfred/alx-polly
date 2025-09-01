// ...existing code...
import { Card } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Authentication</h1>
        <p className="text-muted-foreground">Login or register to continue.</p>
      </Card>
    </main>
  );
}
