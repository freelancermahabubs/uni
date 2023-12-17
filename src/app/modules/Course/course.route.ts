import express from 'express';
import validateRequest from '../../middlwares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';



const router = express.Router();

router.post(
  '/create-course',
  validateRequest(
    CourseValidations.createCourseValidationSchema,
  ),
  CourseControllers.createCourse,
);
router.get('/:id', CourseControllers.getSingleCourses);
router.patch(
  '/:id',
  validateRequest(
    CourseValidations.updateCourseValidationSchema,
  ),
  CourseControllers.updateCourse,
);

router.put('/:courseId/assing-faculties', validateRequest(CourseValidations.facultiesWithCoruseValidationSchema), CourseControllers.assignFaculties)
router.delete('/:courseId/remove-faculties', validateRequest(CourseValidations.facultiesWithCoruseValidationSchema), CourseControllers.assignFaculties)
router.delete('/:id', CourseControllers.deleteCourse);
router.get('/', CourseControllers.getAllCourses);


export const CourseRoutes = router;
