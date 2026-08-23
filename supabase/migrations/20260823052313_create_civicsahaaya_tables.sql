/*
# CivicSahaaya - Core Tables

## Purpose
Creates tables for storing user queries and generated documents for the CivicSahaaya civic/legal assistance platform.

## New Tables
1. `queries` - Stores user problem descriptions and AI analysis results
   - id (uuid, PK)
   - user_id (uuid, FK to auth.users, defaults to auth.uid())
   - question (text, the user's problem description)
   - category (text, detected category like "Tenant/Housing")
   - response (jsonb, full structured AI response)
   - created_at (timestamptz)

2. `documents` - Stores generated documents (RTI, complaints, letters, etc.)
   - id (uuid, PK)
   - user_id (uuid, FK to auth.users, defaults to auth.uid())
   - document_type (text, e.g. "RTI Application", "Consumer Complaint")
   - title (text, short title)
   - content (text, full document text)
   - issue (text, related issue)
   - created_at (timestamptz)

## Security
- RLS enabled on both tables
- Owner-scoped CRUD: authenticated users can only access their own rows
- user_id defaults to auth.uid() so inserts work without explicitly passing user_id
*/

CREATE TABLE IF NOT EXISTS queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  category text,
  response jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_queries" ON queries;
CREATE POLICY "select_own_queries" ON queries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_queries" ON queries;
CREATE POLICY "insert_own_queries" ON queries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_queries" ON queries;
CREATE POLICY "update_own_queries" ON queries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_queries" ON queries;
CREATE POLICY "delete_own_queries" ON queries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  issue text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_documents" ON documents;
CREATE POLICY "select_own_documents" ON documents FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_documents" ON documents;
CREATE POLICY "insert_own_documents" ON documents FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_documents" ON documents;
CREATE POLICY "update_own_documents" ON documents FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_documents" ON documents;
CREATE POLICY "delete_own_documents" ON documents FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
