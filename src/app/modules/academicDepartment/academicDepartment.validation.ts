import { z } from 'zod';

const CreateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department must be sting',
      required_error: 'Name is Required',
    }),
    academicfaculty: z.string({
      invalid_type_error: 'Academic Faculty must be sting',
      required_error: ' Faculty is Required',
    }),
  }),
});

const UpdateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be sting',
        required_error: 'Name is Required',
      })
      .optional(),
    academicfaculty: z
      .string({
        invalid_type_error: 'Academic Faculty must be sting',
        required_error: ' Faculty is Required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  CreateAcademicDepartmentValidationSchema,
  UpdateAcademicDepartmentValidationSchema,
};
