import fs from "fs";
import pdfParse from "pdf-parse";

/**
 * Reads a PDF file and extracts all text.
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function extractPdfText(filePath) {
    try {
        const pdfBuffer = fs.readFileSync(filePath);

        const data = await pdfParse(pdfBuffer);

        return data.text;

    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw error;
    }
}