"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { WysiwygEditor } from "@/components/editor/wysiwyg-editor";
import {
  createAssistantThread,
  addMessageToThread,
  runAssistantOnThread,
  getRunStatus,
  getThreadMessages,
} from "@/lib/openai/client";

interface AssistantChatProps {
  assistantId: string;
  assistantName: string;
  onSaveContent?: (content: string, title: string) => void;
}

export function AssistantChat({
  assistantId,
  assistantName,
  onSaveContent,
}: AssistantChatProps) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize thread on component mount
  useEffect(() => {
    const initThread = async () => {
      try {
        const thread = await createAssistantThread();
        setThreadId(thread.id);
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    };

    initThread();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim() || !threadId) return;

    try {
      setIsLoading(true);
      
      // Add user message to UI
      setMessages((prev) => [...prev, { role: "user", content: userInput }]);
      
      // Add message to thread
      await addMessageToThread(threadId, userInput);
      
      // Clear input
      setUserInput("");
      
      // Run the assistant
      const run = await runAssistantOnThread(threadId, assistantId);
      
      // Poll for completion
      await pollRunStatus(threadId, run.id);
      
      // Get messages after run completes
      const threadMessages = await getThreadMessages(threadId);
      
      // Update UI with all messages
      const formattedMessages = threadMessages.map((msg) => {
        // Extract text content safely
        let content = "";
        if (msg.content && msg.content.length > 0) {
          const contentBlock = msg.content[0];
          if ('text' in contentBlock) {
            content = typeof contentBlock.text === 'object' 
              ? contentBlock.text.value 
              : contentBlock.text;
          }
        }
        
        return {
          role: msg.role,
          content: content,
        };
      });
      
      setMessages(formattedMessages);
      
      // Update editor with assistant's latest response
      const assistantMessages = threadMessages.filter((msg) => msg.role === "assistant");
      if (assistantMessages.length > 0) {
        const latestMessage = assistantMessages[assistantMessages.length - 1];
        
        // Extract text content safely
        let content = "";
        if (latestMessage.content && latestMessage.content.length > 0) {
          const contentBlock = latestMessage.content[0];
          if ('text' in contentBlock) {
            content = typeof contentBlock.text === 'object' 
              ? contentBlock.text.value 
              : contentBlock.text;
          }
        }
        
        setEditorContent(content);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for run completion
  const pollRunStatus = async (threadId: string, runId: string) => {
    const maxAttempts = 60; // 5 minutes (5s * 60)
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const run = await getRunStatus(threadId, runId);
      
      if (run.status === "completed") {
        return;
      }
      
      if (run.status === "failed" || run.status === "cancelled") {
        throw new Error(`Run ${runId} ${run.status}`);
      }
      
      // Wait 5 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }
    
    throw new Error("Run timed out");
  };

  // Handle saving content
  const handleSaveContent = () => {
    if (onSaveContent) {
      onSaveContent(editorContent, documentTitle);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex">
        {/* Chat section */}
        <div className="w-1/2 flex flex-col border-r p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold">{assistantName}</h2>
            <p className="text-sm text-gray-500">
              Chat with the assistant to generate content
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-100 ml-8"
                    : "bg-gray-100 mr-8"
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.role === "user" ? "You" : assistantName}
                </p>
                <p>{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !threadId}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !threadId || !userInput.trim()}
              className="rounded-l-none"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>

        {/* Editor section */}
        <div className="w-1/2 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Editor</h2>
            <p className="text-sm text-gray-500">
              Edit, save, or download the generated content
            </p>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document Title"
            />
          </div>

          <WysiwygEditor
            initialContent={editorContent}
            onSave={handleSaveContent}
            title={documentTitle}
          />
        </div>
      </div>
    </div>
  );
}
