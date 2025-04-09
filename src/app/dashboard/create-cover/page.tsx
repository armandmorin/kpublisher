"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CoverGenerator } from "@/components/images/cover-generator";
import { getCurrentUser } from "@/lib/supabase/utils";

export default function CreateCoverPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user on component mount
  useEffect(() => {
    if (!isClient) return;

    const fetchUser = async () => {
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
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router, isClient]);

  // Handle cover generation success
  const handleCoverGenerated = (imageUrl: string) => {
    // You could add additional logic here if needed
    console.log("Cover generated:", imageUrl);
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

  if (!user) {
    return null; // This should be handled by the redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Book Cover</h1>
        <p className="text-muted-foreground">
          Generate professional book covers using AI.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <CoverGenerator 
          userId={user.id} 
          onCoverGenerated={handleCoverGenerated} 
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tips for Great Book Covers</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Be specific about the genre and mood in your prompt</li>
          <li>Include details about the main character or setting</li>
          <li>Specify color schemes that match your book's tone</li>
          <li>Request professional typography for the title and author name</li>
          <li>Try different variations of your prompt for more options</li>
        </ul>
      </div>
    </div>
  );
}
