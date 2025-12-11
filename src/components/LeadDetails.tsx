import { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText, TrendingUp, TrendingDown, Minus, User, Bot, Wifi } from 'lucide-react';
import { getLead, type Lead } from '../lib/leadsApi';
import { supabase } from '../lib/supabase';
import { SentimentChart } from './SentimentChart';

interface LeadDetailsProps {
  leadId: string;
}

interface Message {
  id: string;
  lead_id: string;
  role: 'user' | 'agent';
  text: string;
  created_at: string;
}

export function LeadDetails({ leadId }: LeadDetailsProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  useEffect(() => {
    loadLead();
    loadMessages();
    subscribeToChanges();
  }, [leadId]);

  async function loadLead() {
    try {
      setLoading(true);
      setError(null);
      const data = await getLead(leadId);
      setLead(data);
    } catch (err) {
      setError('Failed to load lead details');
      console.error('Failed to load lead:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  function subscribeToChanges() {
    const channel = supabase
      .channel(`lead-details-${leadId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
          filter: `id=eq.${leadId}`,
        },
        (payload) => {
          setLead(payload.new as Lead);
          setShowUpdateIndicator(true);
          setTimeout(() => setShowUpdateIndicator(false), 3000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `lead_id=eq.${leadId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setShowUpdateIndicator(true);
          setTimeout(() => setShowUpdateIndicator(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  function getValueBadgeColor(value: string) {
    switch (value) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  function getStatusBadgeColor(status: string) {
    return status === 'live'
      ? 'bg-blue-100 text-blue-800 animate-pulse'
      : 'bg-gray-100 text-gray-800';
  }

  function getSentimentTrend() {
    if (!lead || !lead.sentiment_history || lead.sentiment_history.length < 2) return null;

    const history = lead.sentiment_history;
    const current = history[history.length - 1].score;
    const previous = history[history.length - 2].score;

    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  function getSentimentColor(score: number) {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-gray-600">Loading lead details...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.location.hash = 'dashboard'}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-red-600">{error || 'Lead not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const sentimentTrend = getSentimentTrend();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showUpdateIndicator && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center space-x-3 animate-in fade-in slide-in-from-top-2">
            <Wifi className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">Live update received</span>
          </div>
        )}

        <button
          onClick={() => window.location.hash = 'dashboard'}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                Created {new Date(lead.created_at).toLocaleDateString()}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lead.company_name}</h1>
              <p className="text-xl text-gray-600 mb-4">{lead.project_name}</p>
              {lead.project_summary && (
                <p className="text-gray-700 text-sm leading-relaxed">{lead.project_summary}</p>
              )}
            </div>
            <div className="flex items-center space-x-4 ml-6">
              {lead.status === 'live' && (
                <span className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span>Live</span>
                </span>
              )}
              {lead.status === 'ended' && (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Ended
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Current Sentiment</div>
              <div className="flex items-center space-x-2">
                <span className={`text-3xl font-bold ${getSentimentColor(lead.sentiment_score)}`}>
                  {lead.sentiment_score}
                </span>
                {sentimentTrend === 'up' && <TrendingUp className="text-green-600" size={24} />}
                {sentimentTrend === 'down' && <TrendingDown className="text-red-600" size={24} />}
                {sentimentTrend === 'stable' && <Minus className="text-gray-600" size={24} />}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Team Size</div>
              <div className="text-3xl font-bold text-gray-900">{lead.team_size}</div>
            </div>

             <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Value</div>
              <div className="text-3xl font-bold text-gray-900 capitalize">{lead.value}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Term</div>
              <div className="text-3xl font-bold text-gray-900 capitalize">{lead.term}</div>
            </div>
          </div>

          {(lead.contact_name || lead.contact_email || lead.contact_phone) && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lead.contact_name && (
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="text-gray-900">{lead.contact_name}</div>
                  </div>
                )}
                {lead.contact_email && (
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="text-gray-900">{lead.contact_email}</div>
                  </div>
                )}
                {lead.contact_phone && (
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="text-gray-900">{lead.contact_phone}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead.important_notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap text-sm">{lead.important_notes}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 overflow-visible">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sentiment History</h2>
              {lead.sentiment_history?.length > 0 ? (
                <div className="overflow-visible">
                  <SentimentChart history={lead.sentiment_history} />
                </div>
              ) : (
                <div className="text-gray-500 text-center py-12">
                  No sentiment history available yet
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                {(lead.documents || []).map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="text-gray-400" size={24} />
                      <div>
                        <div className="font-medium text-gray-900 capitalize">{doc.type}</div>
                        <div className="text-sm text-gray-500">{doc.filename}</div>
                      </div>
                    </div>
                    {doc.status === 'generating' ? (
                      <span className="text-sm text-gray-500 italic">Generating...</span>
                    ) : doc.url ? (
                      <a
                        href={doc.url}
                        download={doc.filename}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download size={18} />
                        <span>Download</span>
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">Not available</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Call Transcript</h2>
            {messages.length > 0 ? (
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'agent' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {msg.role === 'agent' ? <Bot size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-900">{msg.role === 'agent' ? 'Agent' : 'User'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${msg.role === 'agent' ? 'bg-blue-50 text-gray-800' : 'bg-green-50 text-gray-800'}`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-12">
                No transcript available yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
