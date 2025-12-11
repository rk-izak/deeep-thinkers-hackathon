import { useState, useRef, useEffect } from 'react';
import { Phone, X, Loader2, User, Bot } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';
import { supabase } from '../lib/supabase';

interface LeadFormData {
  name: string;
  email: string;
  telephone: string;
  projectName: string;
  personName: string;
}

interface Message {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export function VoiceBotButton() {
  const [showModal, setShowModal] = useState(false);
  const [showVoiceBot, setShowVoiceBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leadId, setLeadId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    telephone: '',
    projectName: '',
    personName: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const leadIdRef = useRef<string>('');

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to voice agent');
    },
    onDisconnect: (e) => {
      console.log('Disconnected from voice agent', e);
    },
    onError: (error) => {
      console.error('Voice agent error:', error);
    },
    onMessage: async (message: any) => {
      console.log('Message received:', message);
      console.log('Current lead ID from ref:', leadIdRef.current);

      if (message.role === 'user' && message.message) {
        const newMessage = {
          id: `user-${Date.now()}`,
          role: 'user' as const,
          text: message.message,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);

        if (leadIdRef.current) {
          console.log('Attempting to insert user message with lead_id:', leadIdRef.current);
          const { error } = await supabase.from('messages').insert({
            lead_id: leadIdRef.current,
            role: 'user',
            text: message.message
          });
          if (error) {
            console.error('Error inserting user message:', error);
            console.error('Lead ID used:', leadIdRef.current);
          } else {
            console.log('User message inserted successfully');
          }
        } else {
          console.error('No lead ID available for user message');
        }
      } else if (message.role === 'agent' && message.message) {
        const newMessage = {
          id: `agent-${Date.now()}`,
          role: 'agent' as const,
          text: message.message,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);

        if (leadIdRef.current) {
          console.log('Attempting to insert agent message with lead_id:', leadIdRef.current);
          const { error } = await supabase.from('messages').insert({
            lead_id: leadIdRef.current,
            role: 'agent',
            text: message.message
          });
          if (error) {
            console.error('Error inserting agent message:', error);
            console.error('Lead ID used:', leadIdRef.current);
          } else {
            console.log('Agent message inserted successfully');
          }
        } else {
          console.error('No lead ID available for agent message');
        }
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, conversation.isSpeaking]);

  useEffect(() => {
    if (audioStreamRef.current) {
      const audioTracks = audioStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !conversation.isSpeaking;
      });
    }
  }, [conversation.isSpeaking]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Creating lead with data:', {
        company_name: formData.name,
        project_name: formData.projectName,
        contact_name: formData.personName,
        contact_email: formData.email,
        contact_phone: formData.telephone,
      });

      const { data, error } = await supabase
        .from('leads')
        .insert({
          company_name: formData.name,
          project_name: formData.projectName,
          contact_name: formData.personName,
          contact_email: formData.email,
          contact_phone: formData.telephone,
          status: 'live',
        })
        .select()
        .maybeSingle();

      console.log('Lead insert result:', { data, error });

      if (error) {
        console.error('Error creating lead:', error);
        alert(`Failed to create lead: ${error.message}`);
        throw error;
      }

      if (!data || !data.id) {
        console.error('No lead data returned after insert');
        alert('Failed to create lead - no data returned');
        throw new Error('Failed to create lead - no data returned');
      }

      console.log('Lead created successfully with ID:', data.id);

      const { data: verifyData, error: verifyError } = await supabase
        .from('leads')
        .select('id, company_name')
        .eq('id', data.id)
        .maybeSingle();

      console.log('Lead verification result:', { verifyData, verifyError });

      if (verifyError || !verifyData) {
        console.error('Lead verification failed - lead does not exist in database');
        alert('Lead was created but cannot be verified. Please try again.');
        throw new Error('Lead verification failed');
      }

      console.log('Lead verified successfully in database');
      setLeadId(data.id);
      leadIdRef.current = data.id;

      await new Promise(resolve => setTimeout(resolve, 100));

      setShowModal(false);
      setShowVoiceBot(true);
      await startVoiceCall(data.id);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceCall = async (id: string) => {
    try {
      console.log('Starting voice call with lead ID:', id);
      console.log('leadIdRef.current is:', leadIdRef.current);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      await conversation.startSession({
        agentId: 'agent_5801kc77gvz7fen8nd82syen6z9e',
        dynamicVariables: {
          lead_id: id,
          company_name: formData.name,
          project_name: formData.projectName,
          person_name: formData.personName,
        },
      });

      console.log('Voice call started successfully');
    } catch (error) {
      console.error('Error starting voice call:', error);
      alert('Failed to start voice call. Please check microphone permissions.');
    }
  };

  const handleEndCall = async () => {
    try {
      await conversation.endSession();

      // Stop all audio tracks
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }

      // Update lead status to ended
      if (leadId) {
        const { error } = await supabase
          .from('leads')
          .update({ status: 'ended' })
          .eq('id', leadId);

        if (error) {
          console.error('Error updating lead status:', error);
        }
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }

    setShowVoiceBot(false);
    setMessages([]);
    setLeadId('');
    leadIdRef.current = '';
    setFormData({
      name: '',
      email: '',
      telephone: '',
      projectName: '',
      personName: '',
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all z-50 flex items-center justify-center group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full blur opacity-40 group-hover:opacity-60 transition"></span>
        <Phone className="relative animate-pulse" size={28} />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Start a Voice Call</h2>
              <p className="text-gray-600">Fill in your details to connect with our AI assistant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="personName"
                  name="personName"
                  value={formData.personName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your project name"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Starting Call...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2" size={20} />
                    Start Voice Call
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showVoiceBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative flex flex-col max-h-[90vh]">
            <button
              onClick={handleEndCall}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Voice Call Active</h2>
              <p className="text-gray-600">Lead ID: {leadId}</p>
            </div>

            <div className="flex-1 space-y-4 mb-6 overflow-y-auto px-2">
              {conversation.status === 'connecting' && (
                <div className="flex items-center justify-center space-x-3 p-8">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                  <p className="text-gray-600">Connecting to AI agent...</p>
                </div>
              )}

              {conversation.status === 'connected' && messages.length === 0 && (
                <div className="flex items-center justify-center space-x-3 p-8">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-600">Connected - Start speaking</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'agent' && (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-green-600" size={20} />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-4 max-w-[75%] ${
                      message.role === 'agent'
                        ? 'bg-green-50 text-green-900'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-blue-600" size={20} />
                    </div>
                  )}
                </div>
              ))}

              {conversation.isSpeaking && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-green-600 animate-pulse" size={20} />
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 flex-1">
                    <p className="text-green-900 text-sm font-medium">AI Agent is speaking...</p>
                  </div>
                </div>
              )}

              {conversation.status === 'connected' && !conversation.isSpeaking && (
                <div className="flex items-center justify-center space-x-3 py-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <p className="text-blue-600 font-semibold text-lg">Your turn to speak</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center justify-center space-x-4 border-t pt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${conversation.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-600">{conversation.status}</span>
              </div>

              <button
                onClick={handleEndCall}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center"
              >
                <X className="mr-2" size={18} />
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
