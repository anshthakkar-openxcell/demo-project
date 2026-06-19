import { BarChart3 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col bg-zinc-950 text-white p-10 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Growth Intelligence</span>
        </div>
        <div className="relative z-10 mt-auto space-y-6">
          <blockquote className="space-y-3">
            <p className="text-xl font-medium leading-relaxed text-white/90">
              &ldquo;We replaced 6 disconnected dashboards with Growth Intelligence. Now our entire leadership team has one source of truth for revenue, customer health, and product adoption.&rdquo;
            </p>
            <footer className="text-sm text-white/50">
              <span className="font-medium text-white/70">Sarah Chen</span> · VP Customer Success, Apex Technologies
            </footer>
          </blockquote>
          <div className="flex gap-8 pt-4 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold">$1.1M</div>
              <div className="text-xs text-white/50 mt-0.5">ARR tracked</div>
            </div>
            <div>
              <div className="text-2xl font-bold">109%</div>
              <div className="text-xs text-white/50 mt-0.5">Net Revenue Retention</div>
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-white/50 mt-0.5">Enterprise customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Growth Intelligence</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
