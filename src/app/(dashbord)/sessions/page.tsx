import { NewSession } from "@/containers/sessions/NewSession";

export default function Sessions() {
  return (
    <main className="container mx-auto mt-32">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>

        <NewSession />
      </div>
    </main>
  );
}
