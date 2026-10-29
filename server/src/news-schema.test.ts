import assert from "node:assert/strict";
import test from "node:test";
import { newsInputSchema } from "./news-schema.js";

test("accepts a complete news article", () => {
  const result = newsInputSchema.safeParse({
    title: "Feira de profissões",
    excerpt: "Estudantes apresentam projetos para a comunidade.",
    body: "A comunidade escolar se reuniu para conhecer os projetos dos estudantes.",
    published: true,
  });

  assert.equal(result.success, true);
});

test("rejects incomplete content and invalid publication flags", () => {
  const result = newsInputSchema.safeParse({
    title: "Oi",
    excerpt: "Curto",
    body: "Texto",
    published: "sim",
  });

  assert.equal(result.success, false);
});
