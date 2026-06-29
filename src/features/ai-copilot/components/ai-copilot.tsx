"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles, Loader2, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  timestamp: Date;
};

const SUGGESTED_QUESTIONS = [
  "Why did revenue decline in August?",
  "Which customers are likely to churn in the next 90 days?",
  "What drove retention to drop last quarter?",
  "Which accounts have the highest expansion potential?",
  "What should leadership focus on this week?",
  "Give me a summary of our top 3 at-risk accounts.",
];

const MOCK_RESPONSES: Record<string, { content: string; citations: string[] }> = {
  default: {
    content: `Based on your platform data, here's what I found:

**Revenue declined 2.7% in August** primarily due to two churn events:
- **Quantum Retail** ($8K MRR) churned after low adoption and champion departure
- **RetailPulse Inc** ($4K MRR) churned due to disengagement

These losses **exceeded new business** ($18K new MRR) and expansion ($8K). Your NRR is still positive at **99.8%** for the month.

**Recommended actions:**
1. Focus retention efforts on SwiftPay Solutions (56% churn probability) before October renewal
2. Accelerate CloudNova expansion proposal — they're at 89% seat capacity
3. Schedule Meridian Financial QBR this week

Your portfolio NRR remains at **109.4%** over the trailing 12 months, indicating healthy underlying expansion dynamics.`,
    citations: ["Revenue Events · Aug 2024", "Churn Predictions Model", "Customer Health Scores"],
  },
};

function getAIResponse(question: string): { content: string; citations: string[] } {
  const q = question.toLowerCase();

  if (q.includes("churn") || q.includes("risk")) {
    return {
      content: `**Customers likely to churn in the next 90 days:**

1. **RetailPulse Inc** — 72% churn probability
   - Renewal: Sep 15, 2024 (45 days)
   - Only 15% seat utilization (12/80 seats)
   - Login frequency dropped 84% in 30 days
   - *Immediate: CEO-level outreach required*

2. **Quantum Retail** — 62% churn probability
   - Renewal: Oct 30, 2024 (90 days)
   - Champion left company last month
   - $96K ARR at risk

3. **SwiftPay Solutions** — 56% churn probability
   - Renewal: Oct 1, 2024 (60 days)
   - Usage down 60% month-over-month
   - Budget freeze mentioned in last call

**Combined ARR at risk: $198K** — represents 18.2% of your total ARR.

I recommend prioritizing RetailPulse and SwiftPay for executive escalation this week.`,
      citations: ["Churn Prediction Model v2", "Customer Health Scores", "Product Usage Events"],
    };
  }

  if (q.includes("expansion") || q.includes("upsell") || q.includes("grow")) {
    return {
      content: `**Top expansion opportunities identified:**

1. **CloudNova Systems** — Expansion Score: 85/100
   - Currently at **89% seat utilization** (98/110 seats)
   - Feature adoption rate: 94% — highest in portfolio
   - Potential: **+$36K ARR** tier upgrade
   - Action: Send Enterprise tier proposal this week

2. **Apex Technologies** — Expansion Score: 72/100
   - Strong power-user base (312 daily active users)
   - Using 8/10 features — candidate for AI add-on
   - Potential: **+$48K ARR**

3. **Velocity Health** — Expansion Score: 78/100
   - 91% seat utilization (32/35 seats)
   - NPS: 9.2 — your highest-rated customer
   - Potential: **+$12K ARR**

**Total identified pipeline: $96K+ potential ARR**`,
      citations: ["Expansion Opportunity Engine", "Feature Adoptions", "Customer Health Scores"],
    };
  }

  if (q.includes("focus") || q.includes("week") || q.includes("priority")) {
    return {
      content: `**Leadership Focus — Week of August 19, 2024:**

**Urgent (Revenue at Risk)**
1. **RetailPulse Inc** — 72% churn, $48K ARR, 45 days to renewal
   → CEO call + intervention plan within 48 hours

2. **SwiftPay Solutions** — 56% churn, $54K ARR, 60 days to renewal
   → CSM Sarah Chen to schedule executive meeting

**Important (Growth Opportunities)**
3. **CloudNova Expansion Proposal** — $36K potential ARR
   → Send Enterprise tier proposal today

4. **Meridian Financial QBR** — Overdue 3 months, health declining
   → Schedule this week before risk escalates

**This week's potential impact:**
- Protecting: $102K ARR (RetailPulse + SwiftPay)
- Growing: $36K ARR (CloudNova)
- Total: $138K ARR in this week's pipeline`,
      citations: ["AI Insights Feed", "Customer Health Scores", "Churn Predictions", "Expansion Engine"],
    };
  }

  return MOCK_RESPONSES.default;
}

// Safe inline markdown parser — no dangerouslySetInnerHTML
function parseInline(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold: **...**
    const boldStart = remaining.indexOf("**");
    // Italic: *...* (not **)
    const italicStart = remaining.search(/(?<!\*)\*(?!\*)/);

    const nextBold = boldStart === -1 ? Infinity : boldStart;
    const nextItalic = italicStart === -1 ? Infinity : italicStart;

    if (nextBold === Infinity && nextItalic === Infinity) {
      result.push(remaining);
      break;
    }

    if (nextBold <= nextItalic) {
      // Process bold
      if (boldStart > 0) {
        result.push(remaining.slice(0, boldStart));
      }
      const boldEnd = remaining.indexOf("**", boldStart + 2);
      if (boldEnd === -1) {
        result.push(remaining);
        break;
      }
      result.push(
        <strong key={key++} className="font-semibold text-foreground">
          {remaining.slice(boldStart + 2, boldEnd)}
        </strong>,
      );
      remaining = remaining.slice(boldEnd + 2);
    } else {
      // Process italic
      if (italicStart > 0) {
        result.push(remaining.slice(0, italicStart));
      }
      // Find closing * after the opening *, not preceded or followed by *
      const afterOpen = remaining.slice(italicStart + 1);
      const closeOffset = afterOpen.search(/(?<!\*)\*(?!\*)/);
      if (closeOffset === -1) {
        result.push(remaining);
        break;
      }
      const italicEnd = italicStart + 1 + closeOffset;
      result.push(
        <em key={key++} className="italic text-muted-foreground">
          {remaining.slice(italicStart + 1, italicEnd)}
        </em>,
      );
      remaining = remaining.slice(italicEnd + 1);
    }
  }

  return result;
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line === "") return <div key={i} className="h-1.5" />;

    // List items
    if (line.match(/^\d+\.\s/)) {
      return (
        <p key={i} className="flex gap-2 leading-relaxed">
          <span className="shrink-0 font-semibold text-primary/70">{line.match(/^\d+/)?.[0]}.</span>
          <span>{parseInline(line.replace(/^\d+\.\s/, ""))}</span>
        </p>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <p key={i} className="flex gap-2 leading-relaxed pl-1">
          <span className="shrink-0 text-primary/50 mt-1.5">•</span>
          <span>{parseInline(line.slice(2))}</span>
        </p>
      );
    }
    if (line.startsWith("   →")) {
      return (
        <p key={i} className="leading-relaxed pl-5 text-muted-foreground text-xs">
          {parseInline(line.slice(4).trim())}
        </p>
      );
    }

    return <p key={i} className="leading-relaxed">{parseInline(line)}</p>;
  });
}

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your Growth Intelligence AI Copilot. I have full context on your revenue, customers, product usage, and churn signals. Ask me anything about your business — I'll give you data-backed answers with citations.\n\nTry asking: *\"Why did revenue decline?\"* or *\"Which customers should I focus on this week?\"*",
      citations: [],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async (question?: string) => {
    const text = question ?? input.trim();
    if (!text || isLoading) return;
    setInput("");
    setShowSuggestions(false);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 700));

    const response = getAIResponse(text);
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response.content,
      citations: response.citations,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  }, [input, isLoading]);

  const handleReset = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your Growth Intelligence AI Copilot. I have full context on your revenue, customers, product usage, and churn signals. Ask me anything about your business — I'll give you data-backed answers with citations.\n\nTry asking: *\"Why did revenue decline?\"* or *\"Which customers should I focus on this week?\"*",
      citations: [],
      timestamp: new Date(),
    }]);
    setInput("");
    setShowSuggestions(false);
  };

  const hasConversation = messages.length > 1;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Copilot</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ask anything about your revenue, customers, churn risk, or expansion
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasConversation && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New chat
            </Button>
          )}
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI · Mock Mode
          </Badge>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border bg-muted/10 p-4 space-y-4 mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
          >
            {/* Avatar */}
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              msg.role === "assistant"
                ? "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md shadow-indigo-500/20"
                : "bg-gradient-to-br from-slate-600 to-slate-800",
            )}>
              {msg.role === "assistant"
                ? <Sparkles className="h-3.5 w-3.5 text-white" />
                : <User className="h-3.5 w-3.5 text-white" />}
            </div>

            {/* Bubble */}
            <div className={cn(
              "flex-1 space-y-2",
              msg.role === "user" ? "items-end flex flex-col max-w-lg" : "max-w-2xl",
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm space-y-0.5",
                msg.role === "assistant"
                  ? "bg-background border shadow-sm"
                  : "bg-primary text-primary-foreground rounded-br-sm",
              )}>
                {renderContent(msg.content)}
              </div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.citations.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-medium cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                    >
                      📊 {c}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-muted-foreground/60 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl bg-background border shadow-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn("h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce", {
                      "animation-delay-100": i === 1,
                      "animation-delay-200": i === 2,
                    })}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Analyzing your data</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {!hasConversation && (
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs bg-background hover:bg-muted text-foreground px-3 py-1.5 rounded-full border border-border hover:border-primary/30 hover:text-primary transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {hasConversation && (
        <button
          onClick={() => setShowSuggestions((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors shrink-0 w-fit"
        >
          <Sparkles className="h-3 w-3" />
          {showSuggestions ? "Hide" : "Show"} suggested questions
          <ChevronDown className={cn("h-3 w-3 transition-transform", showSuggestions && "rotate-180")} />
        </button>
      )}

      {hasConversation && showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs bg-background hover:bg-muted text-foreground px-3 py-1.5 rounded-full border border-border hover:border-primary/30 hover:text-primary transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-2 shrink-0">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about revenue, customers, churn risk, or expansion..."
            className="resize-none min-h-[52px] max-h-[120px] pr-3 rounded-xl border-border/80 focus:border-primary/50 transition-colors"
            rows={2}
          />
          <span className="absolute bottom-2 right-2.5 text-[10px] text-muted-foreground/40 font-mono hidden sm:block">
            ↵ send
          </span>
        </div>
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-[52px] w-[52px] shrink-0 rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
        >
          {isLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
