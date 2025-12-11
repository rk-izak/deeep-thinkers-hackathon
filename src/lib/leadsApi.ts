export interface SentimentHistoryEntry {
  timestamp: string;
  score: number;
  reason: string;
}

export interface Document {
  type: 'presentation';
  status: 'generating' | 'ready';
  url: string | null;
  filename: string;
}

export interface Lead {
  id: string;
  created_at: string;
  company_name: string;
  project_name: string;
  sentiment_score: number;
  value: 'low' | 'medium' | 'high' | 'unknown';
  term: 'short' | 'medium' | 'long' | 'unknown';
  team_size: number;
  status: 'live' | 'ended';
  user_id: string | null;
  sentiment_history: SentimentHistoryEntry[];
  project_summary: string;
  important_notes: string;
  transcript: string;
  documents: Document[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

export interface CreateLeadInput {
  company_name: string;
  project_name: string;
  sentiment_score?: number;
  value?: 'low' | 'medium' | 'high' | 'unknown';
  term?: 'short' | 'medium' | 'long' | 'unknown';
  team_size?: number;
  status?: 'live' | 'ended';
  user_id?: string | null;
}

export interface UpdateLeadInput {
  company_name?: string;
  project_name?: string;
  sentiment_score?: number;
  value?: 'low' | 'medium' | 'high' | 'unknown';
  term?: 'short' | 'medium' | 'long' | 'unknown';
  team_size?: number;
  status?: 'live' | 'ended';
  user_id?: string | null;
}

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads`;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

export async function getLeads(): Promise<Lead[]> {
  const response = await fetch(API_BASE_URL, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  return response.json();
}

export async function getLead(id: string): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lead');
  }

  return response.json();
}

export async function createLead(data: CreateLeadInput): Promise<Lead> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create lead');
  }

  return response.json();
}

export async function updateLead(id: string, data: UpdateLeadInput): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update lead');
  }

  return response.json();
}
