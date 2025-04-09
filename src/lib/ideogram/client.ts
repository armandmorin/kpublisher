import { getApiKeyByService } from '../supabase/utils';

// Ideogram API base URL
const IDEOGRAM_API_URL = 'https://api.ideogram.ai/api/v1';

// Function to get the Ideogram API key
async function getIdeogramApiKey(): Promise<string | null> {
  try {
    const apiKey = await getApiKeyByService('ideogram');
    return apiKey?.api_key || null;
  } catch (error) {
    console.error('Error getting Ideogram API key:', error);
    return null;
  }
}

// Function to generate an image using Ideogram
export async function generateImage(prompt: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    const apiKey = await getIdeogramApiKey();
    
    if (!apiKey) {
      return {
        success: false,
        error: 'Ideogram API key not found',
      };
    }
    
    // Make the API request to Ideogram
    const response = await fetch(`${IDEOGRAM_API_URL}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        style: 'natural', // Default style
        width: 1024,
        height: 1024,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to generate image',
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      imageUrl: data.image_url,
    };
  } catch (error) {
    console.error('Error generating image with Ideogram:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Function to list available styles from Ideogram
export async function listStyles(): Promise<{ success: boolean; styles?: string[]; error?: string }> {
  try {
    const apiKey = await getIdeogramApiKey();
    
    if (!apiKey) {
      return {
        success: false,
        error: 'Ideogram API key not found',
      };
    }
    
    // Make the API request to Ideogram
    const response = await fetch(`${IDEOGRAM_API_URL}/styles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to list styles',
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      styles: data.styles,
    };
  } catch (error) {
    console.error('Error listing Ideogram styles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
