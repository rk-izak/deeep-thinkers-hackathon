import { Code, FileJson, Lock, Send } from 'lucide-react';

export function ApiDocs() {
  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads`;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-lg text-gray-600">
            Complete reference for the Leads Management API
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Lock className="text-green-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Public API - No Authentication Required</h3>
              <p className="text-green-800 text-sm">
                This API is completely public and does not require authentication. All endpoints can be accessed without any headers or tokens.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <EndpointSection
            method="GET"
            path="/leads"
            title="Get All Leads"
            description="Retrieve all leads, ordered by creation date (newest first)."
            request={{
              headers: {
                'Content-Type': 'application/json'
              }
            }}
            response={{
              status: 200,
              body: [
                {
                  id: "uuid-here",
                  created_at: "2024-01-15T10:30:00Z",
                  company_name: "TechCorp Inc",
                  project_name: "Mobile App Redesign",
                  contact_name: "John Smith",
                  contact_email: "john@techcorp.com",
                  contact_phone: "+1 555-0100",
                  sentiment_score: 75,
                  sentiment_history: [
                    { timestamp: "2024-01-15T10:30:00Z", score: 75, reason: "Initial sentiment" }
                  ],
                  value: "high",
                  term: "medium",
                  team_size: 5,
                  project_summary: "Complete redesign of mobile application",
                  important_notes: "Client prefers React Native",
                  transcript: "Full conversation transcript...",
                  documents: [
                    { type: "presentation", status: "generating", url: null, filename: "presentation.pdf" }
                  ],
                  status: "live",
                  user_id: "user-uuid-here"
                }
              ]
            }}
            curlExample={`curl -X GET "${baseUrl}"`}
          />

          <EndpointSection
            method="GET"
            path="/leads/:id"
            title="Get Single Lead"
            description="Retrieve details for a specific lead by its ID."
            request={{
              headers: {
                'Content-Type': 'application/json'
              }
            }}
            response={{
              status: 200,
              body: {
                id: "uuid-here",
                created_at: "2024-01-15T10:30:00Z",
                company_name: "TechCorp Inc",
                project_name: "Mobile App Redesign",
                contact_name: "John Smith",
                contact_email: "john@techcorp.com",
                contact_phone: "+1 555-0100",
                sentiment_score: 75,
                sentiment_history: [
                  { timestamp: "2024-01-15T10:30:00Z", score: 75, reason: "Initial sentiment" }
                ],
                value: "high",
                term: "medium",
                team_size: 5,
                project_summary: "Complete redesign of mobile application",
                important_notes: "Client prefers React Native",
                transcript: "Full conversation transcript...",
                documents: [
                  { type: "presentation", status: "generating", url: null, filename: "presentation.pdf" }
                ],
                status: "live",
                user_id: "user-uuid-here"
              }
            }}
            curlExample={`curl -X GET "${baseUrl}/LEAD_ID"`}
          />

          <EndpointSection
            method="POST"
            path="/leads"
            title="Create Lead"
            description="Create a new lead. Only company_name and project_name are required. All other fields are optional. The system automatically initializes sentiment_history and documents arrays."
            request={{
              headers: {
                'Content-Type': 'application/json'
              },
              body: {
                company_name: "TechCorp Inc",
                project_name: "Mobile App Redesign",
                sentiment_score: 75,
                value: "high",
                term: "medium",
                team_size: 5,
                status: "live",
                user_id: null
              }
            }}
            response={{
              status: 201,
              body: {
                id: "uuid-here",
                created_at: "2024-01-15T10:30:00Z",
                company_name: "TechCorp Inc",
                project_name: "Mobile App Redesign",
                contact_name: "",
                contact_email: "",
                contact_phone: "",
                sentiment_score: 75,
                sentiment_history: [
                  { timestamp: "2024-01-15T10:30:00Z", score: 75, reason: "Initial sentiment" }
                ],
                value: "high",
                term: "medium",
                team_size: 5,
                project_summary: "",
                important_notes: "",
                transcript: "",
                documents: [
                  { type: "presentation", status: "generating", url: null, filename: "presentation.pdf" }
                ],
                status: "live",
                user_id: null
              }
            }}
            curlExample={`curl -X POST "${baseUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "company_name": "TechCorp Inc",
    "project_name": "Mobile App Redesign",
    "sentiment_score": 75,
    "value": "high",
    "term": "medium",
    "team_size": 5,
    "status": "live"
  }'`}
          />

          <EndpointSection
            method="PATCH"
            path="/leads/:id"
            title="Update Lead"
            description="Update one or more fields of an existing lead. Only include fields you want to change."
            request={{
              headers: {
                'Content-Type': 'application/json'
              },
              body: {
                sentiment_score: 85,
                status: "ended"
              }
            }}
            response={{
              status: 200,
              body: {
                id: "uuid-here",
                created_at: "2024-01-15T10:30:00Z",
                company_name: "TechCorp Inc",
                project_name: "Mobile App Redesign",
                contact_name: "",
                contact_email: "",
                contact_phone: "",
                sentiment_score: 85,
                sentiment_history: [
                  { timestamp: "2024-01-15T10:30:00Z", score: 75, reason: "Initial sentiment" }
                ],
                value: "high",
                term: "medium",
                team_size: 5,
                project_summary: "",
                important_notes: "",
                transcript: "",
                documents: [
                  { type: "presentation", status: "generating", url: null, filename: "presentation.pdf" }
                ],
                status: "ended",
                user_id: null
              }
            }}
            curlExample={`curl -X PATCH "${baseUrl}/LEAD_ID" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sentiment_score": 85,
    "status": "ended"
  }'`}
          />
        </div>

        <div className="mt-12 space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Types</h2>

            <div className="space-y-4">
              <DataTypeSection
                name="Lead Object"
                fields={[
                  { name: 'id', type: 'string (uuid)', description: 'Unique identifier for the lead' },
                  { name: 'created_at', type: 'string (timestamp)', description: 'ISO 8601 timestamp of creation' },
                  { name: 'company_name', type: 'string', description: 'Name of the potential customer company (required)' },
                  { name: 'project_name', type: 'string', description: 'Name of the potential project (required)' },
                  { name: 'contact_name', type: 'string', description: 'Name of the primary contact person' },
                  { name: 'contact_email', type: 'string', description: 'Email address of the primary contact' },
                  { name: 'contact_phone', type: 'string', description: 'Phone number of the primary contact' },
                  { name: 'sentiment_score', type: 'integer (0-100)', description: 'Likelihood score (50 is neutral, 100 is very optimistic, 0 is unlikely). Default: 50' },
                  { name: 'sentiment_history', type: 'array', description: 'Array of sentiment changes over time with timestamp, score, and reason' },
                  { name: 'value', type: 'enum', description: 'Potential value: "low", "medium", "high", or "unknown". Default: "unknown"' },
                  { name: 'term', type: 'enum', description: 'Project duration: "short", "medium", "long", or "unknown". Default: "unknown"' },
                  { name: 'team_size', type: 'integer', description: 'Number of developers needed (0 or higher). Default: 1' },
                  { name: 'project_summary', type: 'string', description: 'Brief summary of the project requirements and scope' },
                  { name: 'important_notes', type: 'string', description: 'Important notes and considerations for the project' },
                  { name: 'transcript', type: 'string', description: 'Full transcript of the conversation with the lead' },
                  { name: 'documents', type: 'array', description: 'Array of generated documents (presentation) with type, status, url, and filename' },
                  { name: 'status', type: 'enum', description: 'Call status: "live" or "ended". Default: "live"' },
                  { name: 'user_id', type: 'string (uuid) or null', description: 'Optional: ID of the user who owns this lead' },
                ]}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Responses</h2>

            <div className="space-y-4">
              <ErrorSection
                code={404}
                title="Not Found"
                description="The requested lead does not exist"
                example={{ error: "Lead not found" }}
              />
              <ErrorSection
                code={400}
                title="Bad Request"
                description="Invalid request data"
                example={{ error: "company_name and project_name are required" }}
              />
              <ErrorSection
                code={500}
                title="Internal Server Error"
                description="An unexpected error occurred"
                example={{ error: "Internal server error" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EndpointSectionProps {
  method: string;
  path: string;
  title: string;
  description: string;
  request: {
    headers: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    body: any;
  };
  curlExample: string;
}

function EndpointSection({ method, path, title, description, request, response, curlExample }: EndpointSectionProps) {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PATCH: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className={`px-3 py-1 rounded text-sm font-semibold ${methodColors[method]}`}>
            {method}
          </span>
          <code className="text-lg font-mono text-gray-700">{path}</code>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Send size={16} className="text-gray-500" />
              <h4 className="font-semibold text-gray-900">Request</h4>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 mb-1">Headers:</p>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(request.headers, null, 2)}
                </pre>
              </div>
              {request.body && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Body:</p>
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(request.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileJson size={16} className="text-gray-500" />
              <h4 className="font-semibold text-gray-900">Response</h4>
              <span className="text-sm text-gray-500">({response.status})</span>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <pre className="text-xs text-gray-700 overflow-x-auto">
                {JSON.stringify(response.body, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Code size={16} className="text-gray-500" />
              <h4 className="font-semibold text-gray-900">cURL Example</h4>
            </div>
            <div className="bg-gray-900 rounded p-4">
              <pre className="text-xs text-green-400 overflow-x-auto">
                {curlExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DataTypeSectionProps {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

function DataTypeSection({ name, fields }: DataTypeSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{name}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((field) => (
              <tr key={field.name}>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">{field.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{field.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ErrorSectionProps {
  code: number;
  title: string;
  description: string;
  example: any;
}

function ErrorSection({ code, title, description, example }: ErrorSectionProps) {
  return (
    <div className="border-l-4 border-red-500 pl-4">
      <div className="flex items-baseline space-x-2 mb-1">
        <span className="text-lg font-bold text-red-600">{code}</span>
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="bg-gray-50 rounded p-3">
        <pre className="text-xs text-gray-700">
          {JSON.stringify(example, null, 2)}
        </pre>
      </div>
    </div>
  );
}
