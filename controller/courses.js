import * as courseRepository from '../data/courses.js';


export async function getDepartments(req, res) {
    const data = await courseRepository.getAllDepartments();
    res.status(200).json(data);
}


export async function getCourses(req, res) {
    const search = req.query.search;
    const data = await (search
        ? courseRepository.getAllBySearch(search)
        : courseRepository.getAll());
    res.status(200).json(data);
}

export async function getCourseswithDepId(req, res) {
    const search = req.query.search;
    const depId = req.params.depId;
    const data = await (search
        ? courseRepository.getAllBySearchDepId(search, depId)
        : courseRepository.getAllwithDepId(depId));
    res.status(200).json(data);
}

export async function getStudents(req, res) {
    const courseId = req.params.courseId;
    const students = await courseRepository.getStudentswithCourseId(courseId);
    if (students)  {
        res.status(200).json(students);
    } else {
        res.status(404).json({message: `Course id(${courseId}) not found`});
    }
}

export async function getStudentsNum(req, res) {
    const courseId = req.params.courseId;
    const students = await courseRepository.getStudentsNumwithCourseId(courseId);
    if (students)  {
        res.status(200).json(students);
    } else {
        res.status(404).json({message: `Course id(${courseId}) not found`});
    }
}



export async function getCourseInfo(req, res) {
    const courseId = req.params.courseId;
    const course = await courseRepository.getCourseInfo(courseId);    
    if (course)  {
        res.status(200).json(course);
    } else {
        res.status(404).json({message: `Course id(${courseId}) not found`});
    }
}



export async function getJoinInfo(req, res) {
    const courseId = req.params.courseId;
    const data = await courseRepository.getJoinInfo(courseId, req.userId);

    if (data)  {
        res.status(200).json(data);
    } else {
        res.status(404).json({message: `Course id(${courseId}) not found`});
    }
}


export async function getJoinedCourses(req, res) {
    const userId = req.userId;
    const data = await courseRepository.getAllByUserId(userId);
    res.status(200).json(data);
}

export async function getJoinedCourseswithDepId(req, res) {
    const depId = req.params.departmentId;
    const userId = req.userId;
    const data = await courseRepository.getAllwithDepIdByUserId(depId, userId);
    res.status(200).json(data);
}


export async function createJoin(req, res) {
    const courseId = req.params.courseId;
    const userId = req.userId;
    const joined = await courseRepository.getStudentByCourseIdandUserId(courseId, userId);
    if (joined) {
        return res.status(404).json({ message: `Already joined this course: ${courseId}(courseId)` });
    }
    const data = await courseRepository.create(courseId, userId);
    res.status(201).json(data);
}

export async function deleteJoin(req, res) {
    const courseId = req.params.courseId;
    const joinedCourse = await courseRepository.getJoinedCourseById(courseId, req.userId);
    if (!joinedCourse) {
        return res.status(404).json({ message: `Rating not found: ${courseId}` });
    }
    if (joinedCourse.userId != req.userId) {
        return res.sendStatus(403);
    }
    await courseRepository.remove(joinedCourse.dataValues.id);


    res.status(204).json({ message: 'deleted' });

}


export async function getUserInfo(req, res) {
    
    const userId = req.userId;
    const data = await courseRepository.getUser(userId);
    res.status(200).json(data);
}



