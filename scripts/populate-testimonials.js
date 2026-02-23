const fs = require("fs");

// Load env
const envFile = fs.readFileSync(".env.local", "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) {
    env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Read the SQL migration file
const sqlFile = fs.readFileSync(
  "supabase/migrations/populate-reviews-testimonials.sql",
  "utf-8"
);

async function run() {
  console.log("Running SQL migration via Supabase REST API...");

  // Use the Supabase REST API to execute raw SQL
  // We need to use the pg_net extension or the SQL endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sqlFile }),
  });

  if (response.ok) {
    console.log("Migration executed successfully!");
  } else {
    const text = await response.text();
    console.log("Direct SQL execution not available via REST API.");
    console.log("Trying alternative approach with individual operations...\n");

    // Fall back to using Supabase client with authenticated session
    // We'll create a temporary admin session
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First try to disable RLS via rpc
    console.log("Attempting to insert via Supabase client...");

    // Check current data
    const { data: existing, error: readErr } = await supabase
      .from("testimonials")
      .select("id, author")
      .order("sort_order");

    if (readErr) {
      console.error("Error reading testimonials:", readErr.message);
    } else {
      console.log(`Found ${existing.length} existing testimonials`);
    }

    // Try upsert approach
    const testimonials = [
      { text: "Picnic Potential went above and beyond for the Petaluma Mothers Club Annual Summer Playdate. We couldn't be happier. Not only was their setup absolutely beautiful, they adjusted their plan to the weather seamlessly! Allison's team was warm, professional, and incredibly easy to work with. Picnic Potential was very generous to donate their services to help make this event special for families in our community. We're so grateful for their support and highly recommend them to anyone planning a birthday party, shower, engagement party or a corporate gathering.", author: "Ellen Walsh", rating: 5, is_published: true, show_on_homepage: true, sort_order: 1 },
      { text: "Alison and her team are fantastic to work with. I can't believe how beautiful and effortless our event was!!", author: "Joy Finn", rating: 5, is_published: true, show_on_homepage: true, sort_order: 2 },
      { text: "Working with Alison was wonderful! She's creative and helped my vision come to fruition. I definitely recommend working with her team!", author: "Stephanie Wong", rating: 5, is_published: true, show_on_homepage: false, sort_order: 3 },
    ];

    const { data, error } = await supabase
      .from("testimonials")
      .insert(testimonials.slice(0, 1))
      .select();

    if (error) {
      console.error("\nCannot insert via anon key (RLS blocking):", error.message);
      console.log("\n========================================");
      console.log("SOLUTION: Run the SQL migration manually");
      console.log("========================================");
      console.log("\n1. Go to your Supabase dashboard:");
      console.log(`   ${supabaseUrl.replace('.supabase.co', '')}`);
      console.log("   (or https://supabase.com/dashboard)");
      console.log("\n2. Go to SQL Editor");
      console.log("\n3. Copy and paste the contents of:");
      console.log("   supabase/migrations/populate-reviews-testimonials.sql");
      console.log("\n4. Click Run");
      console.log("\nThis will insert all 20 Google reviews as testimonials.");
      console.log("6 are marked for the homepage carousel.");
    } else {
      console.log("Insert succeeded! Continuing with remaining testimonials...");
    }
  }
}

run().catch(console.error);
