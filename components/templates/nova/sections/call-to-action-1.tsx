import Link from "next/link";
import { FlowButton } from "@/components/ui/flow-button";

export default function CallToAction() {
  return (
    <section className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-balance font-serif text-4xl font-medium">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Free and open for everyone. Explore questions from 690+ companies, track your solved progress, and crack your upcoming coding rounds.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard">
              <FlowButton
                text="Browse Companies"
                variant="black"
                className="h-11 px-8 text-sm"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
