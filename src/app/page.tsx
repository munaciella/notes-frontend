// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Laptop, Sparkles, ListChecks } from 'lucide-react';
import heroIllu from '../../public/oc-taking-note.svg';

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/40 to-secondary/30 py-20">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-0">
          {/* Text */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-5xl font-extrabold text-primary-foreground">
              QuillNote
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Capture your ideas in Markdown, organize with tags, and let AI
              generate concise summaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/notes">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            {/* Demo Notice Disclaimer */}
            <p
              role="alert"
              className="inline-block bg-red-100 px-4 py-2 rounded-md text-red-700 font-medium text-md"
            >
              <span className="mr-1">⚠️</span>
              <strong>Demo Notice:</strong>{' '}
              <span className="font-light">
                This demo is provided solely for testing and development
                purposes. Functionality may be limited or subject to sudden
                service restrictions. Use at your own risk.
              </span>
            </p>
          </div>
          {/* Illustration */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center">
            <Image
              src={heroIllu}
              alt="Notes app illustration"
              width={400}
              height={300}
              className="object-contain dark:invert"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-bold text-center">
            Why You’ll Love QuillNote
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ListChecks className="h-8 w-8 text-primary" />}
              title="Organize with Tags"
            >
              Create and filter your notes by custom tags so you always find
              what you need.
            </FeatureCard>
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-primary" />}
              title="AI Summaries"
            >
              Ask QuillNote to summarize any note in a neat paragraph with a
              click.
            </FeatureCard>
            <FeatureCard
              icon={<Laptop className="h-8 w-8 text-primary" />}
              title="Live Markdown Preview"
            >
              Write in Markdown and see your formatting come alive in real time.
            </FeatureCard>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-card rounded-lg shadow hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );
}
