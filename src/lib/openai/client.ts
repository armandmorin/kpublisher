import OpenAI from 'openai';
import { getApiKeyByService } from '../supabase/utils';

let openaiInstance: OpenAI | null = null;

export async function getOpenAIClient(): Promise<OpenAI | null> {
  if (openaiInstance) return openaiInstance;

  try {
    // Get the OpenAI API key from Supabase
    const apiKey = await getApiKeyByService('openai');
    
    if (!apiKey?.api_key) {
      console.error('OpenAI API key not found');
      return null;
    }
    
    // Create a new OpenAI client
    openaiInstance = new OpenAI({
      apiKey: apiKey.api_key,
    });
    
    return openaiInstance;
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    return null;
  }
}

export async function createAssistantThread() {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const thread = await openai.beta.threads.create();
  return thread;
}

export async function addMessageToThread(threadId: string, content: string) {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content,
  });
  
  return message;
}

export async function runAssistantOnThread(threadId: string, assistantId: string) {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
  
  return run;
}

export async function getRunStatus(threadId: string, runId: string) {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const run = await openai.beta.threads.runs.retrieve(threadId, runId);
  return run;
}

export async function getThreadMessages(threadId: string) {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages.data;
}

export async function listAssistants() {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const assistants = await openai.beta.assistants.list({
    limit: 100,
  });
  
  return assistants.data;
}

export async function getAssistant(assistantId: string) {
  const openai = await getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }
  
  const assistant = await openai.beta.assistants.retrieve(assistantId);
  return assistant;
}
