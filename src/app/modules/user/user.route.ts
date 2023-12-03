import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlwares/validateRequest';
import { studentsValidations } from '../students/student.validation';

const router = express.Router();
// will call controller func
router.post(
  '/create-student',
  validateRequest(studentsValidations.createStudentsValidationSchema),
  UserControllers.createStudent,
);

export const UserRoutes = router;
