import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreatePollPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create a New Poll</h1>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Poll Title</label>
            <input id="title" name="title" type="text" className="w-full border rounded px-3 py-2" placeholder="Enter poll title" required />
          </div>
          <div>
            <label htmlFor="option1" className="block text-sm font-medium mb-1">Option 1</label>
            <input id="option1" name="option1" type="text" className="w-full border rounded px-3 py-2" placeholder="First option" required />
          </div>
          <div>
            <label htmlFor="option2" className="block text-sm font-medium mb-1">Option 2</label>
            <input id="option2" name="option2" type="text" className="w-full border rounded px-3 py-2" placeholder="Second option" required />
          </div>
          <Button type="submit" className="mt-4 w-full">Create Poll</Button>
        </form>
      </Card>
    </main>
  );
}
