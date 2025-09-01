import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function PollsPage() {
  return (
    <main className="flex flex-col items-center min-h-screen p-8">
      <div className="flex w-full max-w-2xl justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Polls</h1>
        <Button asChild>
          <a href="/create-poll" className="bg-gradient-to-r from-primary to-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:scale-105 transition-transform">+ New Poll</a>
        </Button>
      </div>
      <div className="w-full max-w-2xl space-y-4">
        {[1,2,3].map((id) => (
          <Card key={id} className="p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow">
            <span className="font-semibold">Poll #{id}</span>
            <span className="text-muted-foreground">This is a placeholder poll description.</span>
            <Button variant="outline" className="self-end">View Poll</Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
