import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xdxqqxpfleypkhgwuguf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkeHFxeHBmbGV5cGtoZ3d1Z3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTY5MjgsImV4cCI6MjA5MzY5MjkyOH0.fLzC803pAJEwEIUZtxvQquyRHcWeb7O4rmvn6OyLcGY';

export const supabase = createClient(supabaseUrl, supabaseKey);