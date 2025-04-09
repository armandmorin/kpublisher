"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AssistantChat } from "@/components/chat/assistant-chat";
import { createBook } from "@/lib/supabase/utils";
import { getAssistants } from "@/lib/supabase/utils";
import { getCurrentUser } from "@/lib/supabase/utils";

export default function CreateBookPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [assistants, setAssistants] = useState<any[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user and assistants on component mount
  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }
        setUser(currentUser);

        // Get available assistants
        const availableAssistants = await getAssistants();
        setAssistants(availableAssistants);

        // Select the first assistant by default if available
        if (availableAssistants.length > 0) {
          setSelectedAssistant(availableAssistants[0].openai_assistant_id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load assistants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, isClient]);

  // Handle saving content
  const handleSaveContent = async (content: string, title: string) => {
    if (!user) return;

    try {
      // Create a new book
      const book = await createBook({
        title,
        content,
        user_id: user.id,
      });

      if (book) {
        // Redirect to the book page
        router.push(`/dashboard/books/${book.id}`);
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    }
  };

  // Handle assistant change
  const handleAssistantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssistant(e.target.value);
  };

  // Don't render anything on the server
  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (assistants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium text-gray-900">No Assistants Available</h3>
          <p className="mt-2 text-gray-500">
            There are no AI assistants configured yet. Please contact an administrator to set up assistants.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Book</h1>
        <p className="text-muted-foreground">
          Chat with an AI assistant to generate content for your book.
        </p>
      </div>

      {/* Assistant selector */}
      <div className="mb-6">
        <label htmlFor="assistant" className="block text-sm font-medium text-gray-700 mb-1">
          Select Assistant
        </label>
        <select
          id="assistant"
          value={selectedAssistant || ""}
          onChange={handleAssistantChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {assistants.map((assistant) => (
            <option key={assistant.id} value={assistant.openai_assistant_id}>
              {assistant.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assistant chat */}
      {selectedAssistant && (
        <div className="border rounded-lg overflow-hidden h-[calc(100vh-250px)]">
          <AssistantChat
            assistantId={selectedAssistant}
            assistantName={
              assistants.find((a) => a.openai_assistant_id === selectedAssistant)?.name || "Assistant"
            }
            onSaveContent={handleSaveContent}
          />
        </div>
      )}
    </div>
  );
}
