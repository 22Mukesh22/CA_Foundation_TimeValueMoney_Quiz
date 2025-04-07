import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfjocviekykuhcocbypv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmam9jdmlla3lrdWhjb2NieXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNjE3MTEsImV4cCI6MjA1OTYzNzcxMX0.Sxq364knHqj1R06l8yBrVCfSK-FxYdM8Y0YCjMRKoj8';

export const supabase = createClient(supabaseUrl, supabaseKey);
