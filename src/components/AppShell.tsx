import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="min-h-[760px] w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-ink/10 bg-paper/90 shadow-soft backdrop-blur">
        {children}
      </div>
    </main>
  );
}

