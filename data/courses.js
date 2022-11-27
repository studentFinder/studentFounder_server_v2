import SQ from 'sequelize';
import { Op } from "sequelize";
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

// 1) Course Items
export const Course = sequelize.define('course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
},
{ timestamps: false }
);

// 2) Department Items
export const Department = sequelize.define('department', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
},
{ timestamps: false }
);


const Student = sequelize.define('student', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
},
{ timestamps: false }
)

Course.belongsTo(Department);

Student.belongsTo(Course);
Student.belongsTo(User);


export const COURSE_INCLUDE_DEPARTMENT = {
    attributes: [
        'id',
        'name',
        [Sequelize.col('department.id'), 'departmentId'],
        [Sequelize.col('department.name'), 'departmentname'],
    ],
    include: {
        model: Department,
        attributes: [],
    },
};

const STUDENT_INCLUDE_USER_COURSE = {
    attributes: [
        'id',
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.col('user.email'), 'email'],
        [Sequelize.col('course.id'), 'courseId'],
        [Sequelize.col('course.name'), 'coursename'],
    ],
    include: [
        {
            model: User,
            attributes: [],
        },
        {
            model: Course,
            attributes: [],
        },
    ]
}

export const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
};


export const ORDER_NAME_ASC = {
    order: [['name', 'ASC']],
};

export async function getAllDepartments() {
    return Department.findAll({...ORDER_NAME_ASC });
}


export async function getAll() {
    return Course.findAll({ ...COURSE_INCLUDE_DEPARTMENT, ...ORDER_NAME_ASC });
}

export async function getAllBySearch(search) {
    return Course.findAll({
        ...COURSE_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: {
            name: { [Op.like]: `%${search}%` },
        },
    });
}

export async function getAllwithDepId(depId) {
    const _depId = depId == 0? { [Op.gt]: 0 }: depId;
    return Course.findAll({
        ...COURSE_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: {
            departmentId: _depId
        },
    })
}

export async function getAllBySearchDepId(search, depId) {//매개변수를 swap해서 받아서 버그났었음. 이런 거 조심.
    const _depId = depId == 0? { [Op.gt]: 0 }: depId;
    return Course.findAll({
        ...COURSE_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: {
            departmentId: _depId,
            name: { [Op.like]: `%${search}%` }
        },
    })
}

export async function getStudentswithCourseId(courseId) {
    const data = await Student.findAll({
        ...STUDENT_INCLUDE_USER_COURSE,
        ORDER_DESC,
        where: { courseId }
    });

    return data;
}

export async function getCourseInfo(courseId) {
    const data = await Course.findOne({
        attributes: [
            'id',
            'name',
            'departmentId',
        ],
        where: {id:courseId},
    });

    return data;
}

export async function getAllByUserId(userId) {
    const data = await Student.findAll({
        attributes: ['courseId'],
        ORDER_DESC,
        where: { userId }
    });

    const courseIds = data.map((i) => i.courseId);

    const courses = await Course.findAll({
        ...COURSE_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: {
            id: {[Op.in]: courseIds}
        },
    });


    return courses;
}

export async function getAllwithDepIdByUserId(depId, userId) {
    const _depId = depId == 0? { [Op.gt]: 0 }: depId;
    const data = await Student.findAll({
        attributes: ['courseId'],
        ORDER_DESC,
        where: { userId }
    });

    const courseIds = data.map((i) => i.courseId);

    const courses = await Course.findAll({
        ...COURSE_INCLUDE_DEPARTMENT,
        ...ORDER_NAME_ASC,
        where: { 
            id: {[Op.in]: courseIds}, 
            departmentId: _depId 
        },
    });

    return courses;
}

export async function create(courseId, userId) {
    return Student.create({
        courseId,
        userId
    }
    ).then((data) => this.getStudentById(data.dataValues.id));
}

export async function getStudentById(id) {
    return Student.findOne({
        where: {id},
    })
}

export async function getStudentByCourseIdandUserId(courseId, userId) {
    return Student.findOne({
        where: {courseId, userId},
    })
}

export async function getJoinInfo(courseId, userId) {
    return Student.findOne({
        where: {courseId, userId},
    })
}

export async function remove(id) {
    
    console.log(id);
    return Student.findByPk(id) //
    .then((e) => {
        e.destroy();
    })
}

export async function getJoinedCourseById(courseId, userId) {
    return Student.findOne({
        where: {courseId, userId},
    })
}

export async function getUser(id) {
    return User.findOne({
        attributes: [
            'id',
            'username',
            'name',
            'email'
        ],
        where: {id},
    })
}