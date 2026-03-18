export interface Note {
  id: number;
  title: string;
  category: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
