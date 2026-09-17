import { CheckCircle2, Database, ShieldCheck, Terminal, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 font-sans text-zinc-100 selection:bg-indigo-500/30">
      <main className="w-full max-w-4xl space-y-12 py-16">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <ShieldCheck className="h-4 w-4" />
            Zero-Tolerance Strict TypeScript & Drizzle Template
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Full-Stack TypeScript Template
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-400">
            Engineered for bulletproof type safety: all forms of <code>any</code>, suppression
            comments, and non-null assertions are banned by the compiler and linter.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950 text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">Maximum Strictness</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Zero <code>any</code> (implicit or explicit), no unchecked indexed access, banned{" "}
              <code>!</code> non-null assertions, and disallowed comment bypasses.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">Drizzle ORM & Postgres</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              TypeScript-native SQL schema, migrations via Drizzle Kit, and integrated runtime
              validation using <code>drizzle-zod</code>.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950 text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-white">Zod & Type-Safe Env</h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Fail-fast environment parsing powered by <code>@t3-oss/env-nextjs</code> and
              compile-time inferred data contracts.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Terminal className="h-4 w-4 text-indigo-400" />
            Quick Commands
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-3">
              <span className="text-zinc-400">Typecheck:</span>
              <span className="text-indigo-300">npm run typecheck</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-3">
              <span className="text-zinc-400">Lint & enforce:</span>
              <span className="text-indigo-300">npm run lint</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-3">
              <span className="text-zinc-400">Run unit tests:</span>
              <span className="text-indigo-300">npm run test</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-3">
              <span className="text-zinc-400">Drizzle Studio:</span>
              <span className="text-indigo-300">npm run db:studio</span>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-zinc-500">
          <p className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Pre-configured with Prettier, Husky &amp; Lint-Staged for clean commits.
          </p>
        </footer>
      </main>
    </div>
  );
}
