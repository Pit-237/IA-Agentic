export type Course = {
  slug: string;
  name: string;
  area: string;
  summary: string;
  duration: string;
  schedule: string;
  semesters: Array<{ term: string; subjects: string[] }>;
};

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean | number;
  created_at: string;
  updated_at: string;
};

export type NewsInput = Pick<NewsArticle, "title" | "excerpt" | "body"> & {
  published: boolean;
};

export type Institution = {
  name: string;
  description: string;
  mission: string;
  values: string[];
  notice: string;
};

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: "same-origin",
    headers,
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(result?.error ?? "Não foi possível concluir a solicitação.");
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}
