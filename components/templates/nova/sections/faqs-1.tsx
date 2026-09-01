import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const faqItems = [
  {
    id: "item-1",
    question: "Where does the problem data come from?",
    answer:
      "The problems are sourced from publicly shared company-wise LeetCode lists, covering 470 companies and 3,257 unique problems. Each problem links directly to LeetCode.",
  },
  {
    id: "item-2",
    question: "Do I need an account?",
    answer:
      "No. KodePrep is completely open - there is no sign-up, no login, and nothing to install. Browse any company list and start solving immediately.",
  },
  {
    id: "item-3",
    question: "Is my progress saved?",
    answer:
      "Not yet. Since there are no accounts, progress tracking is not available today. It is on the roadmap as an optional feature.",
  },
  {
    id: "item-4",
    question: "Can I filter problems by topic or difficulty?",
    answer:
      "Yes. Every problem is tagged with its topics (Arrays, DP, Graphs, and 71 more) and difficulty, so you can narrow any company list down to exactly what you want to practice.",
  },
  {
    id: "item-5",
    question: "Is it free?",
    answer:
      "Yes, completely free for everyone. No credit card, no account, no limits.",
  },
];

export default function FAQs() {
  return (
    <section id="faqs" className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-balance font-serif text-4xl font-medium">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            Everything you need to know about CodePrep.
          </p>
        </div>
        <Card
          // variant="outline"
          className="mt-12 p-2"
        >
          <Accordion>
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b-0 px-4"
              >
                <AccordionTrigger className="cursor-pointer py-4 text-sm font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground pb-2 text-sm">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Still have questions?{" "}
          <Link href="#" className="text-primary font-medium hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </section>
  );
}
