import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Function to convert HTML content to plain text
export function htmlToPlainText(html: string): string {
  // Create a temporary DOM element
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  // Get the text content
  const text = tempElement.textContent || tempElement.innerText || '';
  
  // Return the text with normalized whitespace
  return text.replace(/\s+/g, ' ').trim();
}

// Function to save content as a text file
export function saveAsTextFile(content: string, filename: string): void {
  // Convert to plain text if it's HTML
  const plainText = content.startsWith('<') ? htmlToPlainText(content) : content;
  
  // Create a Blob with the text content
  const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
  
  // Save the file
  saveAs(blob, `${filename}.txt`);
}

// Function to save content as a Word document
export async function saveAsWordDocument(content: string, filename: string): Promise<void> {
  // Convert to plain text if it's HTML
  const plainText = content.startsWith('<') ? htmlToPlainText(content) : content;
  
  // Split the text into paragraphs
  const paragraphs = plainText.split(/\n+/).map(paragraph => {
    return new Paragraph({
      children: [
        new TextRun(paragraph),
      ],
    });
  });
  
  // Create a new Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });
  
  // Generate the document as a Blob
  const blob = await Packer.toBlob(doc);
  
  // Save the file
  saveAs(blob, `${filename}.docx`);
}

// Function to generate a unique filename
export function generateFilename(title: string): string {
  // Remove special characters and replace spaces with hyphens
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  
  // Add a timestamp to ensure uniqueness
  const timestamp = new Date().getTime();
  
  return `${sanitizedTitle}-${timestamp}`;
}
