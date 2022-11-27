import express from 'express';
import { body } from 'express-validator';
import * as courseController from '../controller/courses.js';
import { isAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';



const router = express.Router();

//GET /courses/departments
router.get('/departments', courseController.getDepartments);

//GET /courses
//GET /courses?search?=:search
router.get('/', courseController.getCourses);

//GET /courses/departments/:depId
//GET /courses/departments/:depId/?search=:search
router.get('/departments/:depId', courseController.getCourseswithDepId);

//GET /courses/:courseId
router.get('/:courseId', courseController.getStudents);

//GET /courses/:courseId/num
router.get('/:courseId/num', courseController.getStudentsNum);

//GET /courses/:courseId/info
router.get('/:courseId/info', courseController.getCourseInfo);


//GET /courses/:courseId/joined
router.get('/:courseId/joined', isAuth, courseController.getJoinInfo);

//DELETE /courses/:courseId/joined
router.delete('/:courseId/joined', isAuth, courseController.deleteJoin);


//POST /courses/:courseId
router.post('/:courseId', isAuth, courseController.createJoin);




//GET /courses/account/profile
//GET /courses/account/profile/departments/:departmentId
router.get('/account/profile', isAuth, courseController.getJoinedCourses);
router.get('/account/profile/departments/:departmentId', isAuth, courseController.getJoinedCourseswithDepId);

//GET /courses/account/info
router.get('/account/profile/info', isAuth, courseController.getUserInfo);









export default router;