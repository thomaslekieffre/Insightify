import { extract } from "@extractus/article-extractor";

export async function scrapeUrl(url: string): Promise<string> {
  try {
    const article = await extract(url);

    if (!article) {
      throw new Error("Impossible d'extraire le contenu de l'article");
    }

    // Formater le contenu extrait
    return `
Titre: ${article.title}
${article.author ? `Auteur: ${article.author}\n` : ""}
${article.published ? `Date: ${article.published}\n` : ""}

Contenu:
${article.content}
    `.trim();
  } catch (error) {
    console.error("Erreur de scraping:", error);
    throw new Error("Impossible d'extraire le contenu de l'URL");
  }
}
