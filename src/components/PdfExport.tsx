"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatThread } from "@/lib/utils/tweet-formatter";

type PdfExportProps = {
  fileName?: string;
  content: string;
};

export function PdfExport({ fileName = "resume", content }: PdfExportProps) {
  const handleExport = async (format: "resume" | "thread") => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Configuration initiale
      pdf.setFont("helvetica");
      pdf.setFontSize(11);
      let y = margin;

      const addSection = (title: string) => {
        y += 15; // Plus d'espace avant la section
        pdf.setFontSize(16); // Titre plus grand
        pdf.setFont("helvetica", "bold");
        pdf.text(title, margin, y);
        y += 15; // Plus d'espace après le titre
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
      };

      const addTitle = (title: string, isMain = false) => {
        y += 10;
        pdf.setFont("helvetica", "bold");
        if (isMain) {
          pdf.setFontSize(13);
        }
        pdf.text(title, margin, y);
        y += isMain ? 15 : 10;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
      };

      const addQuote = (quote: string, author?: string) => {
        y += 10;
        // Barre verticale grise pour la citation
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin + 2, y - 5, margin + 2, y + 15);

        // Texte de la citation
        pdf.setFont("helvetica", "italic");
        const quoteLines = pdf.splitTextToSize(quote, contentWidth - 15);
        pdf.text(quoteLines, margin + 8, y);
        y += 6 * quoteLines.length;

        // Auteur de la citation
        if (author) {
          y += 5;
          pdf.setFont("helvetica", "normal");
          pdf.text(`- ${author}`, margin + 8, y);
          y += 8;
        }

        y += 10; // Espace après la citation
        pdf.setFont("helvetica", "normal");
      };

      if (format === "thread") {
        addSection("Thread X");
        const threads = formatThread(content);
        threads.forEach((tweet, index) => {
          pdf.setFont("helvetica", "bold");
          pdf.text(`${index + 1}/${threads.length}`, margin, y);
          y += 6;
          pdf.setFont("helvetica", "normal");

          const tweetLines = pdf.splitTextToSize(tweet, contentWidth - 5);
          pdf.text(tweetLines, margin, y);
          y += 6 * tweetLines.length + 12; // Double espacement entre les tweets

          if (y > 270) {
            pdf.addPage();
            y = margin;
          }
        });
      } else {
        const markdownLines = content.split("\n");
        let currentSection = "";
        let inList = false;

        for (let i = 0; i < markdownLines.length; i++) {
          const line = markdownLines[i];

          // Sections principales
          if (
            line.match(
              /^(Points Clés|Citations Importantes|Chiffres & Statistiques|Conclusion)$/
            )
          ) {
            addSection(line);
            continue;
          }

          // Titre Principal
          if (line.startsWith("Titre Principal")) {
            addTitle(line, true);
            continue;
          }

          // Points numérotés
          if (line.match(/^Point \d+/)) {
            addTitle(line);
            continue;
          }

          // Citations
          if (line.startsWith('"')) {
            // Chercher l'auteur dans la ligne suivante s'il existe
            let author = undefined;
            if (
              i + 1 < markdownLines.length &&
              markdownLines[i + 1].startsWith("-")
            ) {
              author = markdownLines[i + 1].substring(1).trim();
              i++; // Sauter la ligne suivante
            }
            addQuote(line.replace(/^"|"$/g, "").trim(), author);
            continue;
          }

          // Chiffres et statistiques
          if (line.match(/^\d/)) {
            y += 8;
            pdf.setFont("helvetica", "bold");
            const textLines = pdf.splitTextToSize(line, contentWidth - 5);
            pdf.text(textLines, margin, y);
            y += 6 * textLines.length + 8;
            pdf.setFont("helvetica", "normal");
            continue;
          }

          // Texte normal
          if (line.trim()) {
            const textLines = pdf.splitTextToSize(line, contentWidth);
            pdf.text(textLines, margin, y);
            y += 6 * textLines.length + 8;
          }

          // Nouvelle page si nécessaire
          if (y > 270) {
            pdf.addPage();
            y = margin;
          }
        }
      }

      const suffix = format === "thread" ? "thread" : "resume";
      pdf.save(
        `${fileName}-${suffix}-${new Date().toISOString().split("T")[0]}.pdf`
      );
      toast.success("PDF généré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast.error("Impossible de générer le PDF");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="h-4 w-4" />
          Exporter en PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("resume")}>
          Format Résumé
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("thread")}>
          Format Thread
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
