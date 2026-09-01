export default function Content() {
  return (
    <section className="bg-background @container py-24">
      <div className="@2xl:grid-cols-2 mx-auto grid max-w-3xl gap-6 px-6">
        <h2 className="text-balance font-serif text-4xl font-medium">
          Prep the way interviews actually work
        </h2>

        <div className="flex flex-col gap-6">
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Pick a company</span>{" "}
            Start from the exact list of problems reported at the company you
            are interviewing with.
          </p>

          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Filter by topic</span>{" "}
            Narrow any list down to a single pattern - Arrays, DP, Graphs - and
            drill it until it sticks.
          </p>

          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Jump to LeetCode</span>{" "}
            Every problem links straight to its LeetCode page, so you go from
            list to editor in one click.
          </p>
        </div>
      </div>
    </section>
  );
}
