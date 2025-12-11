# AI Voice Sales Agent - Lead Management Platform

A modern web application featuring an AI-powered voice bot for sales conversations with real-time lead tracking and sentiment analysis. Built for hackathon demonstration purposes.

## Features

- **AI Voice Bot**: Interactive voice conversations powered by ElevenLabs AI
- **Real-Time Lead Dashboard**: Live updates as leads are created and modified
- **Sentiment Tracking**: Monitor conversation sentiment scores over time
- **Lead Details View**: Deep dive into individual lead conversations and history
- **Authentication**: Secure access via Clerk authentication
- **REST API**: Backend API for lead management via Supabase Edge Functions
- **Modern UI**: Clean, responsive design built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Voice AI**: ElevenLabs Conversational AI
- **Hosting**: Static hosting ready (includes redirects for SPA)

## Prerequisites

- Node.js 18+ and npm
- Modern web browser with microphone access
- Internet connection

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory with the following credentials:

   ```env
   VITE_SUPABASE_URL=https://otoimhhsuwdkekiuwcru.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90b2ltaGhzdXdka2VraXV3Y3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzE5MTcsImV4cCI6MjA4MTA0NzkxN30.CGpPaGGWB568UhZPEoDRRLQCRbcm6UbcjV0a5d0zOEM
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_aGVscGVkLWxhZHliaXJkLTY4LmNsZXJrLmFjY291bnRzLmRldiQ
   ```

   **Note**: These credentials are provided for hackathon testing purposes. In production, credentials should never be committed to repositories.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

## Usage Guide

### For Visitors (Testing the Voice Bot)

1. Open the application in your browser
2. Click the green phone button in the bottom-right corner
3. Fill in the lead form:
   - Company Name
   - Your Name
   - Email
   - Telephone
   - Project Name
4. Click "Start Voice Call"
5. Allow microphone permissions when prompted
6. Have a conversation with the AI sales agent
7. The conversation is automatically tracked and saved

### For Authenticated Users (Dashboard Access)

1. Click "Sign In" in the header
2. Create an account or sign in with Clerk
3. Access the dashboard to:
   - View all leads in real-time
   - Click on any lead to see detailed conversation history
   - View sentiment analysis charts
   - Edit lead information
   - Access API documentation

## Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Hero.tsx         # Landing page hero
│   │   ├── VoiceBotButton.tsx  # Voice bot interface
│   │   ├── Dashboard.tsx    # Leads dashboard
│   │   ├── LeadDetails.tsx  # Individual lead view
│   │   ├── Services.tsx     # Services section
│   │   ├── About.tsx        # About section
│   │   ├── Contact.tsx      # Contact section
│   │   ├── Footer.tsx       # Page footer
│   │   ├── ApiDocs.tsx      # API documentation
│   │   └── SentimentChart.tsx  # Sentiment visualization
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client setup
│   │   └── leadsApi.ts      # Lead management API
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── migrations/          # Database migrations
│   └── functions/           # Edge functions
│       └── leads/           # Leads API endpoint
├── public/                  # Static assets
└── dist/                    # Production build output
```

## Database Schema

### Tables

**leads**
- `id` (uuid, primary key)
- `company_name` (text)
- `project_name` (text)
- `contact_name` (text)
- `contact_email` (text)
- `contact_phone` (text)
- `sentiment_score` (integer, 0-100)
- `sentiment_history` (jsonb array)
- `value` (enum: unknown, low, medium, high)
- `term` (enum: unknown, short, medium, long)
- `team_size` (integer)
- `status` (enum: live, ended)
- `created_at` (timestamp)

**messages**
- `id` (uuid, primary key)
- `lead_id` (uuid, foreign key)
- `role` (text: 'user' or 'agent')
- `text` (text)
- `created_at` (timestamp)

**profiles**
- `id` (uuid, primary key, references auth.users)
- `email` (text)
- `full_name` (text)
- `created_at` (timestamp)

All tables have Row Level Security (RLS) enabled with appropriate policies.

## API Endpoints

### Supabase Edge Function

**Endpoint**: `https://otoimhhsuwdkekiuwcru.supabase.co/functions/v1/leads`

**Methods**:
- `GET /leads` - Retrieve all leads
- `GET /leads?id=<lead_id>` - Get specific lead
- `POST /leads` - Create new lead
- `PUT /leads` - Update lead
- `DELETE /leads?id=<lead_id>` - Delete lead

**Authentication**: Include Supabase anon key in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90b2ltaGhzdXdka2VraXV3Y3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzE5MTcsImV4cCI6MjA4MTA0NzkxN30.CGpPaGGWB568UhZPEoDRRLQCRbcm6UbcjV0a5d0zOEM
```

## ElevenLabs Voice Agent

The application uses ElevenLabs Conversational AI with a pre-configured agent.

**Agent ID**: `agent_5801kc77gvz7fen8nd82syen6z9e`

The agent is configured to:
- Conduct sales discovery conversations
- Extract project requirements
- Assess customer sentiment
- Store conversation context in the database

## Key Features Explained

### Real-Time Updates

The application uses Supabase real-time subscriptions to automatically update when:
- New leads are created via the voice bot
- Existing leads are modified
- Leads are deleted
- New messages are added to conversations (transcript updates in real-time)

A visual indicator appears when live updates are received. This means if you have a lead details page open while someone is having a voice conversation, you'll see the transcript update in real-time as messages are exchanged.

### Sentiment Tracking

- Sentiment scores range from 0-100
- Color-coded: Green (70+), Yellow (40-69), Red (<40)
- Sentiment history is tracked over time with timestamps
- Visualized in charts on the lead details page

### Lead Categorization

**Value Assessment**:
- High: Significant project value
- Medium: Moderate project value
- Low: Small project value
- Unknown: Not yet determined

**Project Term**:
- Long: Extended engagement
- Medium: Standard timeline
- Short: Quick project
- Unknown: Not yet determined

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Microphone access is required for voice bot functionality.

## Troubleshooting

### Voice Bot Not Connecting
- Ensure microphone permissions are granted
- Check browser console for errors
- Verify internet connection
- Try refreshing the page

### Dashboard Not Loading
- Clear browser cache
- Check that you're signed in with Clerk
- Verify database connection in browser console

### Real-Time Updates Not Working
- Check browser console for WebSocket errors
- Ensure you're on a stable internet connection
- Try refreshing the page to re-establish connection

## License

This project is created for hackathon demonstration purposes.

## Support

For questions or issues during the hackathon, please contact the development team.

---

**Built with**: React, TypeScript, Supabase, ElevenLabs, Clerk, and Tailwind CSS
