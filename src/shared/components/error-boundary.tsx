"use client";

import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-sm dark:border-red-900 dark:bg-red-950/30">
              <h2 className="mb-2 font-semibold text-red-700 dark:text-red-400">
                Render Error
              </h2>
              <pre className="whitespace-pre-wrap break-all text-xs text-red-600 dark:text-red-300">
                {this.state.error?.message}
                {"\n\n"}
                {this.state.error?.stack}
              </pre>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
