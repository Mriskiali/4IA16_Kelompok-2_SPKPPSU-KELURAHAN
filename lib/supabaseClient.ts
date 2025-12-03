import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in different environments
const getEnvVar = (key: string): string => {
  // Check for Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Check for standard process.env (Node/Webpack)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }

  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Initialize real client if keys exist, otherwise return a robust Mock Client
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Mock implementation to prevent crashes when DB is not configured
      from: (table: string) => ({
        select: () => Promise.resolve({ data: null, error: { message: "Offline Mode (Mock Data)" } }),
        insert: (data: any) => Promise.resolve({ data: null, error: { message: "Offline Mode (Mock Data)" } }),
        update: (data: any) => ({ eq: (field: string, value: any) => Promise.resolve({ data: null, error: { message: "Offline Mode (Mock Data)" } }) }),
        delete: () => ({ eq: (field: string, value: any) => Promise.resolve({ data: null, error: { message: "Offline Mode (Mock Data)" } }) }),
      }),
      channel: (name: string) => ({
        on: (event: any, schema: any, callback: any) => ({
             subscribe: () => {} 
        }),
        subscribe: () => {}
      }),
      removeChannel: (subscription: any) => {}
    } as any;