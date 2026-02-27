import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdgbsthvblsnvschlaxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZ2JzdGh2YmxzbnZzY2hsYXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDY4MDQsImV4cCI6MjA4NTk4MjgwNH0.qJ_8tuXP2_jx8g9k8SfaxYiid9U091TrGx3IF7C3pOQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
