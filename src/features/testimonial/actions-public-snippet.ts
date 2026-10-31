// // REPLACE getPublicTestimonialsAction in features/testimonial/actions.ts with this:

// /** Home: getPublicTestimonialsAction(6) — list page: getPublicTestimonialsAction({ page, limit }) */
// export async function getPublicTestimonialsAction(
//   limitOrParams: number | TableParams = 20,
// ): Promise<TestimonialTableResult> {
//   try {
//     const params =
//       typeof limitOrParams === "number"
//         ? { page: 1, limit: limitOrParams }
//         : toApiParams(limitOrParams);
//     const res = await listPublicTestimonialsRequest(params);
//     const data = res.data.data;
//     return {
//       success: true,
//       testimonials: (data.docs ?? []).map((d) => toTestimonial(d as Record<string, unknown>)),
//       meta: data as PaginationMeta,
//     };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err), testimonials: [] };
//   }
// }
