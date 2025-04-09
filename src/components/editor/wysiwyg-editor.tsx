"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { saveAsTextFile, saveAsWordDocument, generateFilename } from "@/lib/documents/generator";

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

interface WysiwygEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  title?: string;
}

export function WysiwygEditor({
  initialContent = "",
  onSave,
  readOnly = false,
  title = "Untitled Document",
}: WysiwygEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [documentTitle, setDocumentTitle] = useState(title);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Update title when title prop changes
  useEffect(() => {
    setDocumentTitle(title);
  }, [title]);

  // Handle content change
  const handleChange = (value: string) => {
    setContent(value);
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  // Handle download as text
  const handleDownloadText = () => {
    saveAsTextFile(content, generateFilename(documentTitle));
  };

  // Handle download as Word document
  const handleDownloadWord = () => {
    saveAsWordDocument(content, generateFilename(documentTitle));
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="flex flex-col space-y-4">
      {!readOnly && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Document Title"
          />
        </div>
      )}

      <div className={`border rounded-md ${readOnly ? "" : "min-h-[400px]"}`}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          readOnly={readOnly}
          className={`${readOnly ? "quill-readonly" : "h-[350px]"}`}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {!readOnly && onSave && (
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            Save
          </Button>
        )}
        <Button onClick={handleDownloadText} variant="outline">
          Download as Text
        </Button>
        <Button onClick={handleDownloadWord} variant="outline">
          Download as Word
        </Button>
      </div>
    </div>
  );
}
