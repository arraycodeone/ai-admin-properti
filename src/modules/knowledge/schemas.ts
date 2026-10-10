import { z } from "zod";

export const faqInputSchema = z.object({
  question: z.string().trim().min(10).max(300),
  answer: z.string().trim().min(10).max(4000),
  visibility: z.enum(["public", "internal"]),
  is_active: z.boolean(),
});

export const faqSchema = faqInputSchema.extend({ id: z.string().uuid() });
export const publicFaqSchema = faqSchema.pick({ id: true, question: true, answer: true });
