import { z } from 'zod';

const UserValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Passwrod must be sting' })
    .max(20, { message: 'Passwrd can not be more than 20 characters ' })
    .optional(),
});
export const UserValidation = {
  UserValidationSchema,
};
