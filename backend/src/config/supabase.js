const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Using service role key for backend operations

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_KEY) are missing.');
  process.exit(1);
}

if (!supabaseUrl.startsWith('http')) {
  console.error(`CRITICAL: Invalid SUPABASE_URL: "${supabaseUrl}". Must be a valid URL starting with http:// or https://`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
