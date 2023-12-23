import express from 'express';
import { StudentsController } from './students.controller';
import { studentsValidations } from './student.validation';
import validateRequest from '../../middlwares/validateRequest';
import auth from '../../middlwares/auth';
const router = express.Router();
// will call controller func

router.get('/', StudentsController.getAllStudents);
router.get('/:id', auth('admin', 'faculty'), StudentsController.getSingleStudents);
router.patch('/:id', validateRequest(studentsValidations.updateStudentValidationSchema) ,StudentsController.updateSudent);
router.delete('/:id', StudentsController.deletetSudent);

export const StudentsRoutes = router;
