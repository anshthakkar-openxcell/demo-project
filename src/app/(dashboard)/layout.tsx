import { Sidebar } from "@/shared/components/layout/sidebar";
import { Topbar } from "@/shared/components/layout/topbar";
import { GlassBackground } from "@/shared/components/layout/glass-background";
import { GlassShatterOverlay } from "@/shared/components/layout/glass-shatter-overlay";
import { PageTransitionWrapper } from "@/shared/components/layout/page-transition-wrapper";
import { ErrorBoundary } from "@/shared/components/error-boundary";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <GlassBackground />
      <GlassShatterOverlay />
      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            <ErrorBoundary>
              <PageTransitionWrapper>
                {children}
              </PageTransitionWrapper>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
