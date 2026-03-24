// utils/fileParser.js
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

export const parseFile = async (file) => {
  if (file.mimetype === "application/pdf") {
    const loadingTask = pdfjsLib.getDocument({
      data: file.buffer,
    });

    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }

    return text;
  }

  if (file.mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  throw new Error("Unsupported file type");
};
