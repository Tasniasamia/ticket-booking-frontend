// import { z } from "zod";

// // name ar description multi-language object, jemon { en: "Music", bn: "সংগীত" }
// const translationsSchema = z.record(z.string(), z.string());

// export const eventCategorySchema = z.object({
//   name: translationsSchema.refine((v) => Object.values(v).some((s) => s.trim() !== ""), {
//     message: "কমপক্ষে একটা ভাষায় নাম দিতে হবে",
//   }),
//   description: translationsSchema,
//   event_category_image_url: z.string().url("সঠিক URL দাও").or(z.literal("")),
//   event_category_image_id: z.number().int().nonnegative(),
// });

// export type EventCategoryFormValues = z.infer<typeof eventCategorySchema>;



import { z } from "zod";

// name ar description multi-language object, jemon { en: "Music", bn: "সংগীত" }
const translationsSchema = z.record(z.string(), z.string());

export const eventCategorySchema = z.object({
  name: translationsSchema.refine(
    (v) => Object.values(v).some((s) => s.trim() !== ""),
    { message: "কমপক্ষে একটা ভাষায় নাম দিতে হবে" },
  ),
  description: translationsSchema,
  event_category_image_url: z.string().url("সঠিক URL দাও").or(z.literal("")),
  event_category_image_id: z.number().int().nonnegative(),
});

export type EventCategoryFormValues = z.infer<typeof eventCategorySchema>;