import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown; context?: unknown };

const SYSTEM_PROMPT = `Du bist der "RentenRadar Renten-Coach", ein freundlicher KI-Assistent, der Menschen in Deutschland hilft, ihre Altersvorsorge und gesetzliche Rente zu verstehen.

Regeln:
- Antworte immer auf Deutsch, in einfacher, klarer Sprache.
- Erkläre Fachbegriffe (z. B. Entgeltpunkte, Rentenniveau, Rentenlücke) verständlich.
- Sei konkret und praxisnah, nutze kurze Absätze und Aufzählungen.
- Beziehe dich, wenn vorhanden, auf die persönlichen Daten des Nutzers (Alter, Gehalt, Rentenschätzung).
- Gib KEINE verbindliche Finanz-, Steuer- oder Rechtsberatung. Weise bei konkreten Entscheidungen freundlich darauf hin, dass eine unabhängige Beratung sinnvoll ist.
- Themen: gesetzliche Rente, Renteneintrittsalter, private Vorsorge, ETFs/Sparpläne, Inflation, Rentenreformen.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const { messages, context } = body;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const contextText =
          context && typeof context === "string" && context.trim().length > 0
            ? `\n\nKontext zum Nutzer (zuletzt berechnet):\n${context}`
            : "";

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT + contextText,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
