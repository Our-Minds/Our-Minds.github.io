
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Webhook handler function started");

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const webhookType = url.searchParams.get('type');
    const body = await req.json();
    
    console.log(`Received webhook: ${webhookType}`);
    console.log(`Webhook payload:`, body);
    
    // Handle different webhook types
    switch (webhookType) {
      case 'payment':
        return await handlePaymentWebhook(body);
      case 'user':
        return await handleUserWebhook(body);
      default:
        return new Response(JSON.stringify({ error: "Unknown webhook type" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

async function handlePaymentWebhook(payload: any) {
  // Process payment webhook (example)
  console.log("Processing payment webhook");
  
  // In a real implementation, you would validate the webhook,
  // update transaction records, etc.
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  });
}

async function handleUserWebhook(payload: any) {
  // Process user webhook (example)
  console.log("Processing user webhook");
  
  // In a real implementation, you would handle user events,
  // like activation, deactivation, etc.
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  });
}
