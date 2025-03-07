import { extractArticle } from "@/lib/services/extractor.service";
import { generateSummary } from "@/lib/services/mistral.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, text } = await request.json();

    if (!url && !text) {
      return NextResponse.json(
        { error: "URL ou texte requis" },
        { status: 400 }
      );
    }

    let contentToAnalyze = text;

    if (url) {
      try {
        const article = await extractArticle(url);
        contentToAnalyze = `
          Titre: ${article.title}
          ${article.description ? `Description: ${article.description}\n` : ""}
          ${article.author ? `Auteur: ${article.author}\n` : ""}
          ${article.published ? `Date: ${article.published}\n` : ""}
          \nContenu:\n${article.content}
        `;
      } catch (error) {
        return NextResponse.json(
          { error: "Erreur lors de l'extraction de l'article" },
          { status: 422 }
        );
      }
    }

    const summary = await generateSummary(contentToAnalyze);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
