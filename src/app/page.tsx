import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">QuillNote</h1>
      <p className="mt-4 text-lg">A simple note-taking app</p>
      <Button className="mt-4" variant="default">
        Get Started
      </Button>
    </main>
  );
}
