const MAX_TWEET_LENGTH = 280;

function createHook(markdown: string): string {
  // Extraire le titre et la première phrase du résumé
  const sections = markdown.split("\n\n");
  const firstPoints = sections.find((s) => s.includes("- **"))?.split("\n- **");

  if (!firstPoints)
    return "🔍 Voici un résumé détaillé de cet article intéressant !";

  // Prendre le premier point clé pour créer l'accroche
  const firstPoint = firstPoints[1]?.split("**")[1]?.trim();
  return `🔍 ${
    firstPoint
      ? `Savez-vous que ${firstPoint.toLowerCase()} ? Thread sur cet article passionnant !`
      : "Voici un résumé détaillé de cet article intéressant !"
  }`;
}

export function formatThread(markdown: string): string[] {
  const tweets: string[] = [];

  // Ajouter le tweet d'accroche
  tweets.push(createHook(markdown));

  const sections = markdown.split("\n\n");
  let currentTweet = "";

  sections.forEach((section) => {
    // Si c'est un titre, on commence un nouveau tweet
    if (section.startsWith("##")) {
      if (currentTweet) tweets.push(currentTweet.trim());
      currentTweet = section.replace("##", "🧵") + "\n\n";
    } else {
      // Pour les citations, on les met dans des tweets séparés
      if (section.startsWith(">")) {
        if (currentTweet) tweets.push(currentTweet.trim());
        currentTweet = "💡 " + section.replace(">", "").trim() + "\n\n";
      } else {
        // Pour les listes, on traite chaque item séparément
        if (section.includes("\n- ")) {
          const items = section.split("\n- ");
          items.forEach((item, index) => {
            if (index === 0) return; // Skip empty first item
            const formattedItem = `• ${item.trim()}`;

            if ((currentTweet + formattedItem).length > MAX_TWEET_LENGTH) {
              tweets.push(currentTweet.trim());
              currentTweet = formattedItem + "\n\n";
            } else {
              currentTweet += formattedItem + "\n\n";
            }
          });
        } else {
          // Pour le texte normal
          if ((currentTweet + section).length > MAX_TWEET_LENGTH) {
            tweets.push(currentTweet.trim());
            currentTweet = section + "\n\n";
          } else {
            currentTweet += section + "\n\n";
          }
        }
      }
    }
  });

  if (currentTweet) tweets.push(currentTweet.trim());

  // Ajouter un tweet de conclusion
  tweets.push(
    "🎯 Merci d'avoir lu ce thread ! N'hésitez pas à le partager si vous l'avez trouvé utile !"
  );

  // Ajouter les numéros de thread
  return tweets.map((tweet, index) => `${index + 1}/${tweets.length} ${tweet}`);
}
