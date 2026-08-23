import { supabase } from './supabase';
import type { SavedDocument } from './types';

export async function saveDocument(doc: Omit<SavedDocument, 'id' | 'created_at'>): Promise<{ data: SavedDocument | null; error: string | null }> {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      document_type: doc.document_type,
      title: doc.title,
      content: doc.content,
      issue: doc.issue,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getDocuments(): Promise<{ data: SavedDocument[] | null; error: string | null }> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as SavedDocument[], error: null };
}

export async function deleteDocument(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function updateDocument(id: string, content: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('documents').update({ content }).eq('id', id);
  return { error: error?.message ?? null };
}

export function downloadAsText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsHTML(filename: string, title: string, content: string) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
body { font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1a1a1a; }
h1 { font-size: 18px; text-align: center; margin-bottom: 30px; }
.document-content { white-space: pre-wrap; }
</style>
</head>
<body>
<div class="document-content">${content.replace(/</g, '&lt;')}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsPDF(filename: string, title: string, content: string) {
  // Generate a printable HTML and open in new window for PDF printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    downloadAsHTML(filename, title, content);
    return;
  }
  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
body { font-family: 'Times New Roman', Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1a1a1a; }
h1 { font-size: 18px; text-align: center; margin-bottom: 30px; }
.document-content { white-space: pre-wrap; }
@media print { body { margin: 0; padding: 20px; } }
</style>
</head>
<body>
<div class="document-content">${content.replace(/</g, '&lt;')}</div>
<script>window.onload = function() { window.print(); }</script>
</body>
</html>`);
  printWindow.document.close();
}
