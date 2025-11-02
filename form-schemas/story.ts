import { z } from "zod";

export const StoryFormSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  voice: z.enum(["MALE", "FEMALE"]),
});

export type StoryFormSchemaType = z.infer<typeof StoryFormSchema>;
