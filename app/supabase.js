// utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
export const supabase = createClient(supabaseUrl, supabaseKey);
