"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateImage } from "@/lib/ideogram/client";
import { createBookCover } from "@/lib/supabase/utils";

interface CoverGeneratorProps {
  userId: string;
  onCoverGenerated?: (imageUrl: string) => void;
}

export function CoverGenerator({ userId, onCoverGenerated }: CoverGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [authorName, setAuthorName] = useState("");

  // Handle generating a book cover
  const handleGenerateCover = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      setError(null);

      // Generate the image
      const result = await generateImage(prompt);

      if (!result.success || !result.imageUrl) {
        setError(result.error || "Failed to generate image");
        return;
      }

      // Set the generated image
      setGeneratedImage(result.imageUrl);

      // Save the cover to the database
      if (userId) {
        await createBookCover({
          image_url: result.imageUrl,
          prompt,
          user_id: userId,
        });
      }

      // Call the callback if provided
      if (onCoverGenerated) {
        onCoverGenerated(result.imageUrl);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle downloading the image
  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `book-cover-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate a prompt based on book title and author
  const generatePrompt = () => {
    if (!bookTitle) return;

    const basePrompt = `A professional book cover for "${bookTitle}"`;
    const authorPrompt = authorName ? ` by ${authorName}` : "";
    const stylePrompt = ", photorealistic, high quality, professional design";

    setPrompt(`${basePrompt}${authorPrompt}${stylePrompt}`);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Book Cover Generator</h2>
        <p className="text-gray-500">
          Generate professional book covers using AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="bookTitle" className="block text-sm font-medium mb-1">
              Book Title
            </label>
            <input
              id="bookTitle"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label htmlFor="authorName" className="block text-sm font-medium mb-1">
              Author Name
            </label>
            <input
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name (optional)"
            />
          </div>

          <Button onClick={generatePrompt} variant="outline" className="w-full">
            Generate Prompt
          </Button>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Describe the book cover you want to generate"
            />
          </div>

          <Button
            onClick={handleGenerateCover}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Cover"}
          </Button>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="aspect-[2/3] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated book cover"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-center p-4">
                Your generated cover will appear here
              </div>
            )}
          </div>

          {generatedImage && (
            <Button onClick={handleDownload} variant="outline" className="w-full">
              Download Cover
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
