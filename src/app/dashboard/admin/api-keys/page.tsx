"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getApiKeys, saveApiKey } from "@/lib/supabase/utils";

export default function ApiKeysPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<any>({
    openai: "",
    ideogram: "",
    stripe: "",
  });
  const [isSaving, setIsSaving] = useState<{
    openai: boolean;
    ideogram: boolean;
    stripe: boolean;
  }>({
    openai: false,
    ideogram: false,
    stripe: false,
  });
  const [saveSuccess, setSaveSuccess] = useState<{
    openai: boolean;
    ideogram: boolean;
    stripe: boolean;
  }>({
    openai: false,
    ideogram: false,
    stripe: false,
  });

  // Fetch user and API keys on component mount
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

        // Get API keys
        const keys = await getApiKeys();
        const keyMap: any = { openai: "", ideogram: "", stripe: "" };
        
        keys.forEach((key: any) => {
          if (key.service in keyMap) {
            keyMap[key.service] = key.api_key;
          }
        });
        
        setApiKeys(keyMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load API keys. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Handle input change
  const handleInputChange = (service: string, value: string) => {
    setApiKeys((prev: any) => ({
      ...prev,
      [service]: value,
    }));
    
    // Reset success state when input changes
    setSaveSuccess((prev) => ({
      ...prev,
      [service]: false,
    }));
  };

  // Handle save API key
  const handleSaveKey = async (service: string) => {
    try {
      setIsSaving((prev) => ({
        ...prev,
        [service]: true,
      }));
      
      // Save API key
      await saveApiKey({
        service: service as "openai" | "ideogram" | "stripe",
        api_key: apiKeys[service],
      });
      
      // Set success state
      setSaveSuccess((prev) => ({
        ...prev,
        [service]: true,
      }));
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess((prev) => ({
          ...prev,
          [service]: false,
        }));
      }, 3000);
    } catch (error) {
      console.error(`Error saving ${service} API key:`, error);
      alert(`Failed to save ${service} API key. Please try again.`);
    } finally {
      setIsSaving((prev) => ({
        ...prev,
        [service]: false,
      }));
    }
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
        <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Manage API keys for external services.
        </p>
      </div>

      <div className="grid gap-6">
        {/* OpenAI API Key */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">OpenAI API Key</h2>
          <p className="text-sm text-gray-500 mb-4">
            Used for generating book content using OpenAI's assistant API.
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={apiKeys.openai}
              onChange={(e) => handleInputChange("openai", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OpenAI API Key"
            />
            <Button
              onClick={() => handleSaveKey("openai")}
              disabled={isSaving.openai || !apiKeys.openai}
            >
              {isSaving.openai ? "Saving..." : "Save"}
            </Button>
          </div>
          
          {saveSuccess.openai && (
            <p className="text-sm text-green-500 mt-2">
              OpenAI API key saved successfully!
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-4">
            Get your API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenAI's API Keys page
            </a>
          </p>
        </div>

        {/* Ideogram API Key */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Ideogram API Key</h2>
          <p className="text-sm text-gray-500 mb-4">
            Used for generating book covers using Ideogram's image generation API.
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={apiKeys.ideogram}
              onChange={(e) => handleInputChange("ideogram", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Ideogram API Key"
            />
            <Button
              onClick={() => handleSaveKey("ideogram")}
              disabled={isSaving.ideogram || !apiKeys.ideogram}
            >
              {isSaving.ideogram ? "Saving..." : "Save"}
            </Button>
          </div>
          
          {saveSuccess.ideogram && (
            <p className="text-sm text-green-500 mt-2">
              Ideogram API key saved successfully!
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-4">
            Get your API key from{" "}
            <a
              href="https://ideogram.ai/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Ideogram's API page
            </a>
          </p>
        </div>

        {/* Stripe API Key */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Stripe API Key</h2>
          <p className="text-sm text-gray-500 mb-4">
            Used for processing payments and managing subscriptions.
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={apiKeys.stripe}
              onChange={(e) => handleInputChange("stripe", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Stripe Secret Key"
            />
            <Button
              onClick={() => handleSaveKey("stripe")}
              disabled={isSaving.stripe || !apiKeys.stripe}
            >
              {isSaving.stripe ? "Saving..." : "Save"}
            </Button>
          </div>
          
          {saveSuccess.stripe && (
            <p className="text-sm text-green-500 mt-2">
              Stripe API key saved successfully!
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-4">
            Get your API key from{" "}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Stripe's API Keys page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
