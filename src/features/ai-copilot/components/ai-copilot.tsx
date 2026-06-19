"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
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

1. **RetailPulse Inc** — 72% churn probability 🔴
   - Renewal: Sep 15, 2024 (45 days)
   - Only 15% seat utilization (12/80 seats)
   - Login frequency dropped 84% in 30 days
   - **Immediate: CEO-level outreach required**

2. **Quantum Retail** — 62% churn probability 🔴
   - Renewal: Oct 30, 2024 (90 days)
   - Champion left company last month
   - $96K ARR at risk

3. **SwiftPay Solutions** — 56% churn probability 🟠
   - Renewal: Oct 1, 2024 (60 days)
   - Usage down 60% month-over-month
   - Budget freeze mentioned in last call
   - **$54K ARR at risk**

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
   - Champion is a promoter (NPS 9/10)
   - Action: Send Enterprise tier proposal this week

2. **Apex Technologies** — Expansion Score: 72/100
   - Strong power-user base (312 daily active users)
   - Using 8/10 features — candidate for AI add-on
   - Potential: **+$48K ARR**
   - Action: Upsell AI Copilot + advanced analytics

3. **Velocity Health** — Expansion Score: 78/100
   - 91% seat utilization (32/35 seats)
   - NPS: 9.2 — your highest-rated customer
   - Potential: **+$12K ARR**
   - Action: Seat expansion + referral request

**Total identified pipeline: $96K+ potential ARR**`,
      citations: ["Expansion Opportunity Engine", "Feature Adoptions", "Customer Health Scores"],
    };
  }

  if (q.includes("focus") || q.includes("week") || q.includes("priority")) {
    return {
      content: `**Leadership Focus — Week of August 19, 2024:**

**🔴 Urgent (Revenue at Risk)**
1. **RetailPulse Inc** — 72% churn, $48K ARR, 45 days to renewal
   → CEO call + intervention plan within 48 hours

2. **SwiftPay Solutions** — 56% churn, $54K ARR, 60 days to renewal
   → CSM Sarah Chen to schedule executive meeting

**🟡 Important (Growth Opportunities)**
3. **CloudNova Expansion Proposal** — $36K potential ARR
   → Send Enterprise tier proposal today

4. **Meridian Financial QBR** — Overdue 3 months, health declining
   → Schedule this week before risk escalates

**📊 Strategic**
5. **August Revenue Review** — MRR declined 2.7% due to churn
   → Leadership review of churn prevention playbook

**This week's potential impact:**
- Protecting: $102K ARR (RetailPulse + SwiftPay)
- Growing: $36K ARR (CloudNova)
- Total: $138K ARR in this week's pipeline`,
      citations: ["AI Insights Feed", "Customer Health Scores", "Churn Predictions", "Expansion Engine"],
    };
  }

  return MOCK_RESPONSES.default;
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(question?: string) {
    const text = question ?? input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const response = getAIResponse(text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      citations: response.citations,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI Copilot</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Ask anything about your business — revenue, customers, churn, expansion</p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          GPT-4o · Mock Mode
        </Badge>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-muted/20 p-4 space-y-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              msg.role === "assistant" ? "bg-primary/10" : "bg-secondary",
            )}>
              {msg.role === "assistant" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
            </div>
            <div className={cn("flex-1 space-y-2 max-w-2xl", msg.role === "user" && "items-end flex flex-col")}>
              <div className={cn(
                "rounded-xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "assistant"
                  ? "bg-background border"
                  : "bg-primary text-primary-foreground",
              )}>
                {msg.content.split("\n").map((line, i) => {
                  const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                  const italic = bold.replace(/\*(.*?)\*/g, "<em>$1</em>");
                  return (
                    <p
                      key={i}
                      className={line === "" ? "h-2" : ""}
                      dangerouslySetInnerHTML={{ __html: italic }}
                    />
                  );
                })}
              </div>
              {msg.citations && msg.citations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {msg.citations.map((c) => (
                    <span key={c} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                      📊 {c}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background border px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Analyzing your data...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full border transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 shrink-0">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about your revenue, customers, churn risk, or expansion opportunities..."
          className="resize-none min-h-[52px] max-h-[120px]"
          rows={2}
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="h-[52px] w-[52px] shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
