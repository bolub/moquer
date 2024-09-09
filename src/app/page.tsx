import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen px-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Moquer</h1>
        <p className="text-lg">Manage mock data while testing your app.</p>
        <Link href="/sessions">
          <Button>Get started</Button>
        </Link>
      </main>
    </div>
  );
}
