"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getAssistants, saveAssistant, deleteAssistant } from "@/lib/supabase/utils";
import { listAssistants as listOpenAIAssistants } from "@/lib/openai/client";

export default function AssistantsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAssistants, setSavedAssistants] = useState<any[]>([]);
  const [openaiAssistants, setOpenaiAssistants] = useState<any[]>([]);
  const [isLoadingOpenAI, setIsLoadingOpenAI] = useState(false);
  const [openaiError, setOpenaiError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch user and assistants on component mount
  useEffect(() => {
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

        // Check if user is admin
        if (currentUser.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        setUser(currentUser);

        // Get saved assistants
        const assistants = await getAssistants();
        setSavedAssistants(assistants);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load assistants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Fetch OpenAI assistants
  const fetchOpenAIAssistants = async () => {
    try {
      setIsLoadingOpenAI(true);
      setOpenaiError(null);

      // Get OpenAI assistants
      const assistants = await listOpenAIAssistants();
      setOpenaiAssistants(assistants);
    } catch (error) {
      console.error("Error fetching OpenAI assistants:", error);
      setOpenaiError("Failed to load OpenAI assistants. Please check your API key.");
    } finally {
      setIsLoadingOpenAI(false);
    }
  };

  // Handle adding an assistant
  const handleAddAssistant = async (assistant: any) => {
    try {
      setIsAdding(true);

      // Save assistant
      await saveAssistant({
        name: assistant.name,
        openai_assistant_id: assistant.id,
      });

      // Refresh saved assistants
      const assistants = await getAssistants();
      setSavedAssistants(assistants);
    } catch (error) {
      console.error("Error adding assistant:", error);
      alert("Failed to add assistant. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle deleting an assistant
  const handleDeleteAssistant = async (id: string) => {
    try {
      setIsDeleting(id);

      // Delete assistant
      await deleteAssistant(id);

      // Refresh saved assistants
      const assistants = await getAssistants();
      setSavedAssistants(assistants);
    } catch (error) {
      console.error("Error deleting assistant:", error);
      alert("Failed to delete assistant. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Check if an OpenAI assistant is already saved
  const isAssistantSaved = (assistantId: string) => {
    return savedAssistants.some((assistant) => assistant.openai_assistant_id === assistantId);
  };

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

  if (!user || user.role !== "admin") {
    return null; // This should be handled by the redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Assistants</h1>
        <p className="text-muted-foreground">
          Configure OpenAI assistants for book content generation.
        </p>
      </div>

      {/* Current assistants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Current Assistants</h2>
        
        {savedAssistants.length === 0 ? (
          <p className="text-gray-500">No assistants configured yet.</p>
        ) : (
          <div className="space-y-4">
            {savedAssistants.map((assistant) => (
              <div
                key={assistant.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div>
                  <h3 className="font-medium">{assistant.name}</h3>
                  <p className="text-sm text-gray-500">ID: {assistant.openai_assistant_id}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAssistant(assistant.id)}
                  disabled={isDeleting === assistant.id}
                >
                  {isDeleting === assistant.id ? "Deleting..." : "Remove"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add assistants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Add Assistants from OpenAI</h2>
        
        <div className="mb-4">
          <Button
            onClick={fetchOpenAIAssistants}
            disabled={isLoadingOpenAI}
          >
            {isLoadingOpenAI ? "Loading..." : "Fetch OpenAI Assistants"}
          </Button>
        </div>
        
        {openaiError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            {openaiError}
          </div>
        )}
        
        {openaiAssistants.length > 0 && (
          <div className="space-y-4">
            {openaiAssistants.map((assistant) => (
              <div
                key={assistant.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div>
                  <h3 className="font-medium">{assistant.name}</h3>
                  <p className="text-sm text-gray-500">ID: {assistant.id}</p>
                  {assistant.description && (
                    <p className="text-sm text-gray-500 mt-1">{assistant.description}</p>
                  )}
                </div>
                <Button
                  variant={isAssistantSaved(assistant.id) ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleAddAssistant(assistant)}
                  disabled={isAssistantSaved(assistant.id) || isAdding}
                >
                  {isAssistantSaved(assistant.id)
                    ? "Already Added"
                    : isAdding
                    ? "Adding..."
                    : "Add Assistant"}
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {!isLoadingOpenAI && openaiAssistants.length === 0 && !openaiError && (
          <p className="text-gray-500">
            Click the button above to fetch your assistants from OpenAI.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">How to Create Assistants</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to the <a href="https://platform.openai.com/assistants" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Assistants page</a></li>
          <li>Click "Create" to create a new assistant</li>
          <li>Configure your assistant with the desired model and instructions</li>
          <li>Return to this page and click "Fetch OpenAI Assistants"</li>
          <li>Add the assistants you want to make available to your users</li>
        </ol>
      </div>
    </div>
  );
}
