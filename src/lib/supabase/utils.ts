import { supabase, User, Book, BookCover, ApiKey, Assistant } from './config';

// User operations
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data as User | null;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
    
  return data as User | null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return data as User | null;
}

// Book operations
export async function getBooks(userId: string): Promise<Book[]> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  return data as Book[] || [];
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();
    
  return data as Book | null;
}

export async function createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book | null> {
  const { data } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single();
    
  return data as Book | null;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
  const { data } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return data as Book | null;
}

export async function deleteBook(id: string): Promise<void> {
  await supabase
    .from('books')
    .delete()
    .eq('id', id);
}

// Book Cover operations
export async function getBookCovers(userId: string): Promise<BookCover[]> {
  const { data } = await supabase
    .from('book_covers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  return data as BookCover[] || [];
}

export async function createBookCover(cover: Omit<BookCover, 'id' | 'created_at' | 'updated_at'>): Promise<BookCover | null> {
  const { data } = await supabase
    .from('book_covers')
    .insert(cover)
    .select()
    .single();
    
  return data as BookCover | null;
}

export async function deleteBookCover(id: string): Promise<void> {
  await supabase
    .from('book_covers')
    .delete()
    .eq('id', id);
}

// API Key operations
export async function getApiKeys(): Promise<ApiKey[]> {
  const { data } = await supabase
    .from('api_keys')
    .select('*');
    
  return data as ApiKey[] || [];
}

export async function getApiKeyByService(service: 'openai' | 'ideogram' | 'stripe'): Promise<ApiKey | null> {
  const { data } = await supabase
    .from('api_keys')
    .select('*')
    .eq('service', service)
    .single();
    
  return data as ApiKey | null;
}

export async function saveApiKey(apiKey: Omit<ApiKey, 'id' | 'created_at' | 'updated_at'>): Promise<ApiKey | null> {
  // Check if key already exists
  const { data: existingKey } = await supabase
    .from('api_keys')
    .select('*')
    .eq('service', apiKey.service)
    .single();
    
  if (existingKey) {
    // Update existing key
    const { data } = await supabase
      .from('api_keys')
      .update({ api_key: apiKey.api_key })
      .eq('id', existingKey.id)
      .select()
      .single();
      
    return data as ApiKey | null;
  } else {
    // Create new key
    const { data } = await supabase
      .from('api_keys')
      .insert(apiKey)
      .select()
      .single();
      
    return data as ApiKey | null;
  }
}

// Assistant operations
export async function getAssistants(): Promise<Assistant[]> {
  const { data } = await supabase
    .from('assistants')
    .select('*');
    
  return data as Assistant[] || [];
}

export async function getAssistantById(id: string): Promise<Assistant | null> {
  const { data } = await supabase
    .from('assistants')
    .select('*')
    .eq('id', id)
    .single();
    
  return data as Assistant | null;
}

export async function saveAssistant(assistant: Omit<Assistant, 'id' | 'created_at' | 'updated_at'>): Promise<Assistant | null> {
  const { data } = await supabase
    .from('assistants')
    .insert(assistant)
    .select()
    .single();
    
  return data as Assistant | null;
}

export async function deleteAssistant(id: string): Promise<void> {
  await supabase
    .from('assistants')
    .delete()
    .eq('id', id);
}
