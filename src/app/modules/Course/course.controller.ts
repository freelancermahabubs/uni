import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCoruseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Course Create is  succesfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromBD(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are retrieved succesfully',
    data: result,
  });
});

const getSingleCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromBD(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved succesfully',
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CourseServices.updateCourseIntoBD(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated succesfully',
    data: result,
  });
});

const assignFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Assinged succesfully',
    data: result,
  });
});
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesWithCourseFromDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties Removed succesfully',
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseIntoBD(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted succesfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourses,
  updateCourse,
  assignFaculties,
  deleteCourse,
  removeFacultiesFromCourse,
};
