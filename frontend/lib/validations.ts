import { z } from "zod"

export const FiltersSchema = z.object({
  must_include: z.array(z.string()).default([]),
  must_exclude: z.array(z.string()).default([]),
  sort: z.enum(["latest", "relevant"]).default("latest"),
  page: z.number().int().min(1).max(5).default(1),
})

export const ScrapeQuerySchema = z.object({
  topic: z.string().min(1),
  filters: FiltersSchema,
})

export type ScrapeQueryInput = z.infer<typeof ScrapeQuerySchema>
