"use client";

import { useRef, useEffect, useState } from "react";
import { useInsightStore } from "@/lib/stores/insight.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { TweetThread } from "./TweetThread";
import { InsightHistory } from "./InsightHistory";
import { PdfExport } from "./PdfExport";
import { saveInsight } from "@/lib/services/storage.service";
import { InsightStats } from "./InsightStats";

const EXAMPLE_TEXT = `Titre: The Impact of Climate Change on Global Health

Contenu:
Climate change is one of the biggest global health threats facing the 21st century. According to the World Health Organization (WHO), between 2030 and 2050, climate change is expected to cause approximately 250,000 additional deaths per year from malnutrition, malaria, diarrhea and heat stress.

In addition to its direct impacts on health, climate change also has indirect impacts. For example, rising temperatures and changing precipitation patterns can affect food production and water availability, leading to food insecurity and water scarcity in many regions.

To address the health impacts of climate change, it is essential to take action to reduce greenhouse gas emissions and build resilience to climate impacts.

> "Climate change is not just an environmental issue, it is a health issue." - Dr. Tedros Adhanom Ghebreyesus, Director-General of the World Health Organization

> "The health impacts of climate change are already being felt, and they are only going to get worse if we don't take action." - Dr. Maria Neira, WHO Director of Public Health and Environment`;

export function InsightForm() {
  const {
    url,
    text,
    summary,
    stats,
    isLoading,
    error,
    setUrl,
    setText,
    setSummary,
    setStats,
    setLoading,
    setError,
    reset,
  } = useInsightStore();
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>("resume");

  // Auto-focus sur l'input URL au chargement
  useEffect(() => {
    urlInputRef.current?.focus();
  }, []);

  const extractStatsFromSummary = (summary: string) => {
    const statsMatch = summary.match(/```json\n([\s\S]*?)\n```/);
    if (!statsMatch) return null;

    try {
      const statsJson = JSON.parse(statsMatch[1]);
      // Retire la section stats du résumé
      const cleanSummary = summary.replace(/```json\n[\s\S]*?\n```/, "").trim();
      return { stats: statsJson, cleanSummary };
    } catch (e) {
      console.error("Erreur lors du parsing des stats:", e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !text) {
      setError("Veuillez entrer une URL ou un texte");
      toast.error("Veuillez entrer une URL ou un texte");
      return;
    }

    if (url && !isValidUrl(url)) {
      setError("URL invalide");
      toast.error("URL invalide");
      return;
    }

    if (text && text.length < 50) {
      setError("Le texte doit contenir au moins 50 caractères");
      toast.error("Le texte est trop court");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, text }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error(
            "Impossible d'extraire le contenu de l'URL. Essayez de copier-coller le texte directement."
          );
        }
        throw new Error(data.error || "Une erreur est survenue");
      }

      const statsData = extractStatsFromSummary(data.summary);
      if (statsData) {
        setSummary(statsData.cleanSummary);
        setStats(statsData.stats);
      } else {
        setSummary(data.summary);
      }

      // Sauvegarder dans l'historique
      await saveInsight({ url, text, summary: data.summary });
      toast.success("Résumé généré avec succès !");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    urlInputRef.current?.focus();
    toast.info("Formulaire réinitialisé");
  };

  const handleUseExample = () => {
    setText(EXAMPLE_TEXT);
    setUrl("");
    setError(null);
    toast.info("Exemple ajouté ! Cliquez sur Analyser pour le tester.");
  };

  const handleBeforeExport = async () => {
    if (activeTab !== "resume") {
      setActiveTab("resume");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Insightify</CardTitle>
          <CardDescription>
            Entrez une URL ou collez votre texte pour obtenir un résumé
            intelligent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={urlInputRef}
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              className="w-full"
            />
            <div className="relative">
              <Textarea
                placeholder="Ou collez votre texte ici..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[200px]"
              />
              {!text && !url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={handleUseExample}
                >
                  Utiliser l'exemple
                </Button>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyse en cours..." : "Analyser"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Résultat</CardTitle>
          {summary && <PdfExport content={summary} />}
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="mb-6">
              <InsightStats stats={stats} />
            </div>
          )}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resume">Résumé</TabsTrigger>
              <TabsTrigger value="thread">Thread X</TabsTrigger>
            </TabsList>
            <TabsContent value="resume" className="mt-4">
              <div
                id="insight-content"
                className="prose prose-sm dark:prose-invert w-full max-w-none prose-headings:mb-3 prose-headings:mt-6 prose-h2:text-xl prose-h2:font-semibold prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-blockquote:my-2 prose-blockquote:pl-4 prose-blockquote:border-l-2 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600"
              >
                {summary ? (
                  <ReactMarkdown>{summary}</ReactMarkdown>
                ) : (
                  <div className="text-muted-foreground">
                    <p>
                      Je suis désolé, mais vous n'avez pas fourni de texte à
                      analyser. Veuillez fournir un article ou un texte en
                      anglais pour que je puisse en extraire les insights clés
                      et les présenter au format Markdown demandé.
                    </p>
                    <p>
                      Si vous avez besoin d'aide pour formater votre demande,
                      voici un exemple de la façon dont vous pouvez fournir le
                      texte :
                    </p>
                    <pre className="bg-muted/50 p-4 rounded-md mt-4 overflow-auto">
                      {EXAMPLE_TEXT}
                    </pre>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="thread" className="mt-4">
              <TweetThread markdown={summary || ""} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <InsightHistory />
    </div>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
