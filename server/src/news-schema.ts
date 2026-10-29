import { z } from "zod";

export const newsInputSchema = z.object({
  title: z.string().trim().min(5).max(100),
  excerpt: z.string().trim().min(10).max(280),
  body: z.string().trim().min(20).max(10000),
  published: z.boolean(),
});

export type NewsInput = z.infer<typeof newsInputSchema>;
