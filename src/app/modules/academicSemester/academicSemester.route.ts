import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { AcademicSemesterValidaton } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.post(
  '/create-academic-semesters',
  validateRequest(
    AcademicSemesterValidaton.CreateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);
router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
);
router.patch(
    '/:semesterId',
    validateRequest(
        AcademicSemesterValidaton.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateAcademicSemester,
  );
router.get('/', AcademicSemesterControllers.getAllAcademicSemesters);

export const AcademicSemesterRoutes = router;
