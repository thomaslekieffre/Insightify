import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: "mistral-medium",
  temperature: 0.7,
  maxTokens: 1024,
});

const SYSTEM_PROMPT = `Tu es un expert en analyse de texte qui extrait les insights clés d'un article ou texte.
Si le texte est en anglais, traduis-le en français.

Ta mission est de fournir un résumé structuré au format Markdown. Utilise EXACTEMENT cette structure :

## Points Clés
- **Point 1** : [explication concise]
- **Point 2** : [explication concise]
- **Point 3** : [explication concise]
(3 à 5 points clés)

## Citations Importantes
> "[Citation 1 importante et percutante]"

> "[Citation 2 importante et percutante]"
(2 à 3 citations)

## Chiffres & Statistiques
- **[Chiffre ou métrique]** : [contexte et importance]
- **[Chiffre ou métrique]** : [contexte et importance]
(Si aucun chiffre n'est présent, écris "Aucun chiffre ou statistique mentionné dans le texte")

## Conclusion
[Synthèse concise et percutante de 2-3 phrases maximum]

Règles de formatage :
1. Respecte EXACTEMENT la structure des titres avec ##
2. Utilise des tirets (-) pour les listes
3. Mets en gras (**) les points clés et chiffres importants
4. Utilise le format blockquote (>) pour les citations
5. Laisse une ligne vide entre chaque section
6. Si le texte est en anglais, traduis TOUT en français`;

export async function generateSummary(text: string): Promise<string> {
  try {
    const response = await model.invoke([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text },
    ]);

    return (
      response.content.toString() || "Désolé, je n'ai pas pu générer de résumé."
    );
  } catch (error) {
    throw new Error(
      "Erreur lors de la génération du résumé: " +
        (error instanceof Error ? error.message : "Erreur inconnue")
    );
  }
}
