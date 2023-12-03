import express from 'express';
import { StudentsController } from './students.controller';
import { studentsValidations } from './student.validation';
import validateRequest from '../../middlwares/validateRequest';
const router = express.Router();
// will call controller func

router.get('/', StudentsController.getAllStudents);
router.get('/:studentId', StudentsController.getSingleStudents);
router.patch('/:studentId', validateRequest(studentsValidations.updateStudentValidationSchema) ,StudentsController.updateSudent);
router.delete('/:studentId', StudentsController.deletetSudent);

export const StudentsRoutes = router;
