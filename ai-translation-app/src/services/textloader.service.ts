// src/services/TextLoader.ts
export const ASIMOV_FILE = "asimov.txt";

export class TextLoader {
  static async loadTextFile(fileName: string): Promise<string> {
    const res = await fetch(`./${fileName}`);
    if (!res.ok) {
      throw new Error(`Error al cargar el archivo: ${fileName}`);
    }
    return await res.text();
  }

  static splitTextIntoParagraphs(
    text: string,
    minSentences: number = 4
  ): string[] {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const paragraphs: string[] = [];
    let currentParagraphLines: string[] = [];

    for (const line of lines) {
      currentParagraphLines.push(line);
      const combined = currentParagraphLines.join(" ");
      if (countSentences(combined) >= minSentences) {
        paragraphs.push(combined);
        currentParagraphLines = [];
      }
    }

    // Añadir el último párrafo aunque tenga menos oraciones
    if (currentParagraphLines.length > 0) {
      paragraphs.push(currentParagraphLines.join(" "));
    }

    return paragraphs;
  }
}

// Función auxiliar para contar oraciones (buscando ".", "!", "?" simples)
function countSentences(str: string): number {
  const matches = str.match(/[.!?]+/g);
  return matches ? matches.length : 0;
}
