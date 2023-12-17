import { z } from 'zod';

const PreRequisiteCoruseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    preRequisitecourses: z.array(PreRequisiteCoruseValidationSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const updatePreRequisiteCoruseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisitecourses: z
      .array(updatePreRequisiteCoruseValidationSchema)
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const facultiesWithCoruseValidationSchema = z.object({
  body: z.object({
    faculties: z.string(z.string()),
  }),
});
export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  facultiesWithCoruseValidationSchema,
};
