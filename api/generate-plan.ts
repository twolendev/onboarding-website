/* eslint-disable @typescript-eslint/no-explicit-any */
import Anthropic from "@anthropic-ai/sdk";

export const config = {
  maxDuration: 60,
};

const SYSTEM_PROMPT = `Du bist ein Kraftsport-Experte der Trainingspläne basierend auf wissenschaftlichen Meta-Analysen erstellt. Erstelle einen personalisierten Wochenplan. Erkläre bei jeder Entscheidung kurz warum – basierend auf Trainingswissenschaft.

Formatiere den Plan in Markdown mit folgender Struktur:
- Ein kurzes Athleten-Profil basierend auf den Angaben
- Den Wochenplan Tag für Tag (mit Übungen, Sätzen, Wiederholungen, RPE)
- Kurze wissenschaftliche Begründungen in kursiv unter jeder Entscheidung
- Hinweise zu Progression und Deload-Strategie
- Anpassungen basierend auf genannten Einschränkungen/Verletzungen

Antworte komplett auf Deutsch.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { statsAndGoals, schedule, limitations } = req.body;

  if (!statsAndGoals || !schedule) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `Hier sind meine Angaben:

**1. Aktuelle Leistungsdaten und Ziele:**
${statsAndGoals}

**2. Verfügbare Trainingszeit:**
${schedule}

**3. Verletzungen / Einschränkungen:**
${limitations || "Keine bekannt."}

Erstelle mir bitte einen detaillierten, personalisierten Krafttrainingsplan.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const plan = textBlock && "text" in textBlock ? textBlock.text : "No plan generated.";

    return res.status(200).json({ plan });
  } catch (err: any) {
    console.error("Anthropic API error:", err);
    return res.status(502).json({
      error: "Failed to generate plan",
      details: err.message || "Unknown error",
    });
  }
}
