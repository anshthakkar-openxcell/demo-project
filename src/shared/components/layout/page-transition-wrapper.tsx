"use client";

import { usePathname } from "next/navigation";

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter h-full">
      {children}
    </div>
  );
}
