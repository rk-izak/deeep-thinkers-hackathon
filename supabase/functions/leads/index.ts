import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);

    // Extract lead ID from path
    // URL format: /functions/v1/leads/:id
    const pathParts = url.pathname.split("/").filter(Boolean);

    // Find the index of 'leads' and get the next element as the ID
    const leadsIndex = pathParts.findIndex(part => part === 'leads');
    const leadId = leadsIndex !== -1 && pathParts.length > leadsIndex + 1
      ? pathParts[leadsIndex + 1]
      : null;

    if (req.method === "GET") {
      if (leadId) {
        const { data, error } = await supabaseClient
          .from("leads")
          .select("*")
          .eq("id", leadId)
          .maybeSingle();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        if (!data) {
          return new Response(
            JSON.stringify({ error: "Lead not found" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(
          JSON.stringify(data),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else {
        const { data, error } = await supabaseClient
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(
          JSON.stringify(data),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (req.method === "POST") {
      const body = await req.json();
      const {
        company_name,
        project_name,
        sentiment_score = 50,
        value = "unknown",
        term = "unknown",
        team_size = 1,
        status = "live",
        user_id = null,
      } = body;

      if (!company_name || !project_name) {
        return new Response(
          JSON.stringify({ error: "company_name and project_name are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const now = new Date().toISOString();
      const initialSentimentHistory = [
        {
          timestamp: now,
          score: sentiment_score,
          reason: "Initial sentiment",
        },
      ];

      const defaultDocuments = [
        {
          type: "presentation",
          status: "generating",
          url: null,
          filename: "presentation.pdf",
        },
      ];

      const { data, error } = await supabaseClient
        .from("leads")
        .insert({
          company_name,
          project_name,
          sentiment_score,
          value,
          term,
          team_size,
          status,
          user_id,
          sentiment_history: initialSentimentHistory,
          documents: defaultDocuments,
          project_summary: "",
          important_notes: "",
          transcript: "",
          contact_name: "",
          contact_email: "",
          contact_phone: "",
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "PATCH") {
      if (!leadId) {
        return new Response(
          JSON.stringify({ error: "Lead ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const body = await req.json();
      const allowedFields = [
        "company_name",
        "project_name",
        "sentiment_score",
        "sentiment_history",
        "value",
        "term",
        "team_size",
        "status",
        "user_id",
        "documents",
        "project_summary",
        "important_notes",
        "transcript",
        "contact_name",
        "contact_email",
        "contact_phone",
      ];

      const updates: Record<string, unknown> = {};
      let needsCurrentData = false;

      // Check if we need to fetch current data for appending
      if (body.sentiment_history || body.documents) {
        needsCurrentData = true;
      }

      let currentLead = null;
      if (needsCurrentData) {
        const { data: currentData, error: fetchError } = await supabaseClient
          .from("leads")
          .select("sentiment_history, documents")
          .eq("id", leadId)
          .maybeSingle();

        if (fetchError) {
          return new Response(
            JSON.stringify({ error: fetchError.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        if (!currentData) {
          return new Response(
            JSON.stringify({ error: "Lead not found" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        currentLead = currentData;
      }

      for (const [key, value] of Object.entries(body)) {
        if (allowedFields.includes(key)) {
          if (key === "sentiment_history" && Array.isArray(value) && currentLead) {
            // Append new sentiment history entries to existing ones
            const existingHistory = currentLead.sentiment_history || [];
            const updatedHistory = [...existingHistory, ...value];
            updates[key] = updatedHistory;

            // Update sentiment_score to the newest score
            if (updatedHistory.length > 0) {
              const newestEntry = updatedHistory[updatedHistory.length - 1];
              updates["sentiment_score"] = newestEntry.score;
            }
          } else if (key === "documents" && Array.isArray(value) && currentLead) {
            // Override documents by type instead of appending
            const existingDocuments = currentLead.documents || [];
            const updatedDocuments = [...existingDocuments];

            // Process each incoming document
            value.forEach((newDoc: any) => {
              // Set status based on url presence
              if (newDoc.url) {
                newDoc.status = "ready";
              } else if (!newDoc.status) {
                newDoc.status = "generating";
              }

              // Find existing document with same type
              const existingIndex = updatedDocuments.findIndex(
                (doc: any) => doc.type === newDoc.type
              );

              if (existingIndex !== -1) {
                // Override existing document
                updatedDocuments[existingIndex] = {
                  ...updatedDocuments[existingIndex],
                  ...newDoc,
                };
              } else {
                // Add new document
                updatedDocuments.push(newDoc);
              }
            });

            updates[key] = updatedDocuments;
          } else {
            updates[key] = value;
          }
        }
      }

      if (Object.keys(updates).length === 0) {
        return new Response(
          JSON.stringify({ error: "No valid fields to update" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("leads")
        .update(updates)
        .eq("id", leadId)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!data) {
        return new Response(
          JSON.stringify({ error: "Lead not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});