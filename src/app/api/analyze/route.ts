import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/services/mistral.service";
import { scrapeUrl } from "@/lib/services/scraper.service";

export async function POST(request: Request) {
  try {
    const { url, text } = await request.json();
    let content = text;

    console.log("Requête reçue:", { url, text });

    if (url && !text) {
      console.log("Tentative de scraping de l'URL:", url);
      try {
        content = await scrapeUrl(url);
        console.log("Contenu extrait avec succès, longueur:", content.length);
      } catch (error) {
        console.error("Erreur lors du scraping:", error);
        return NextResponse.json(
          { error: "Impossible d'extraire le contenu de l'URL" },
          { status: 422 }
        );
      }
    }

    if (!content) {
      console.log("Aucun contenu à analyser");
      return NextResponse.json(
        { error: "Aucun contenu à analyser" },
        { status: 400 }
      );
    }

    console.log("Génération du résumé...");
    const summary = await generateSummary(content);
    console.log("Résumé généré avec succès");

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Erreur lors de l'analyse:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du contenu" },
      { status: 500 }
    );
  }
}
