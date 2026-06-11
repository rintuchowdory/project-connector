import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/coach")({
  head: () => ({ meta: [{ title: "KI Renten-Coach – RentenRadar" }] }),
  component: CoachPage,
});

const SUGGESTIONS = [
  "Kann ich mit 63 in Rente gehen?",
  "Wie viel sollte ich monatlich sparen?",
  "Lohnen sich ETFs für die Altersvorsorge?",
  "Was passiert, wenn ich Teilzeit arbeite?",
];

function getStoredContext(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("rentenradar:last-result") ?? "";
}

function CoachPage() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: () => {},
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function submit(text: string) {
    if (!text.trim() || isLoading) return;
    sendMessage(
      { text },
      { body: { context: getStoredContext() } },
    );
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        <div className="mb-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <Sparkles className="h-6 w-6 text-accent" />
            KI Renten-Coach
          </h1>
          <p className="text-sm text-muted-foreground">
            Stelle deine Fragen zur Rente und Altersvorsorge – verständlich erklärt.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-4"
        >
          {messages.length === 0 && (
            <div className="space-y-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Womit kann ich dir helfen?
              </p>
              <div className="mx-auto grid max-w-lg gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            return (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-headings:my-2">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  ) : (
                    text
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                schreibt …
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mt-4 flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Deine Frage zur Rente…"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Allgemeine Informationen, keine verbindliche Finanzberatung.{" "}
          <Link to="/rechner" className="underline">
            Erst Rente berechnen
          </Link>{" "}
          für persönlichere Antworten.
        </p>
      </main>
    </div>
  );
}
