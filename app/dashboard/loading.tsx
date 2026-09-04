export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Skeleton Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r bg-sidebar shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-36 rounded-md bg-muted animate-pulse" />
            <div className="h-7 w-7 rounded-md bg-muted animate-pulse" />
          </div>
          <div className="h-8 w-full rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Sidebar Categories */}
        <div className="flex-1 px-3 py-4 space-y-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                <div
                  className="h-3.5 rounded bg-muted animate-pulse"
                  style={{ width: `${60 + i * 12}px` }}
                />
              </div>
              {i <= 2 && (
                <div className="pl-4 space-y-1">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between px-2 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md bg-muted animate-pulse" />
                        <div
                          className="h-3 rounded bg-muted animate-pulse"
                          style={{ width: `${50 + j * 20}px` }}
                        />
                      </div>
                      <div className="h-4 w-7 rounded-md bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Skeleton Header */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 backdrop-blur-md px-4 sm:px-6">
          <div className="h-7 w-7 rounded-md bg-muted animate-pulse" />
          <div className="h-5 w-px bg-border mx-1" />
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-16 rounded bg-muted animate-pulse" />
            <span className="text-muted-foreground/40">/</span>
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          </div>
          <div className="ml-auto">
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
          </div>
        </header>

        {/* Skeleton Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Company Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-6 w-40 rounded bg-muted animate-pulse" />
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 rounded-full bg-muted animate-pulse"
                style={{ width: `${70 + i * 10}px` }}
              />
            ))}
          </div>

          {/* Search + Controls */}
          <div className="flex items-center gap-3">
            <div className="h-9 flex-1 max-w-sm rounded-lg bg-muted animate-pulse" />
            <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
            <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
          </div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-4 space-y-3"
                style={{
                  animationDelay: `${i * 75}ms`,
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div
                      className="h-4 rounded bg-muted animate-pulse"
                      style={{ width: `${55 + (i % 4) * 10}%` }}
                    />
                    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-5 w-5 rounded bg-muted animate-pulse shrink-0 ml-2" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 2 + (i % 3) }).map((_, j) => (
                    <div
                      key={j}
                      className="h-5 rounded-full bg-muted animate-pulse"
                      style={{ width: `${40 + j * 15}px` }}
                    />
                  ))}
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
                  <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
