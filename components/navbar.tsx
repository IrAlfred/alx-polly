import Link from "next/link";
import { cn } from "@/lib/utils";
export default function Navbar() {
  return (
    <nav className={cn("w-full border-b bg-card text-card-foreground shadow-sm")}> 
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-2">
          <Link href="/polls" className="font-bold text-xl">Polly</Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/polls" className="hover:underline">Polls</Link>
          <Link href="/create-poll" className="hover:underline">Create Poll</Link>
          <Link href="/auth" className="hover:underline">Login</Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Placeholder user icon */}
          <span className="inline-block w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">U</span>
        </div>
      </div>
    </nav>
  );
}
