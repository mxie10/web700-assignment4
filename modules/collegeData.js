// Do not expose your Neon credentials to the browser
// .env
PGHOST = 'ep-ancient-boat-58377806-pooler.us-east-2.aws.neon.tech'
PGDATABASE = 'SenecaDB'
PGUSER = 'mxie10'
PGPASSWORD = 'UPyw2LiM6ISv'
ENDPOINT_ID = 'ep-ancient-boat-58377806-pooler'

// app.js
const postgres = require('pg');

const Sequelize = require('sequelize');
var sequelize = new Sequelize(
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    {
        host: PGHOST,
        dialect: 'postgres',
        port: 5432,
        dialectOptions: { ssl: { rejectUnauthorized: false } },
        query: { raw: true }
    }
);

var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING, 
    lastName: Sequelize.STRING, 
    email: Sequelize.STRING, 
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
});

var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING, 
    courseDescription: Sequelize.STRING, 
});

Course.hasMany(Student, {foreignKey: 'course'});

const initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize
        .sync({ force: true })
        .then(function () {
            resolve('Connection has been established successfully.');
        })
        .catch(function (err) {
            reject('Unable to sync the database');
        });
    })
}

const getAllStudents = () => {
    return new Promise((resolve, reject) => {
        Student.findAll().then(students => {
            resolve(students);
        })
        .catch(error=>{
            reject(error.message);
        })
    })
}

const getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:{
                course:course
            }
        }).then(students=>{
            resolve(students);
        }).catch(err=>{
            reject("No results returned");
        })
    })
}

const getCourses = () => {
    return new Promise((resolve, reject) => {
        Course.findAll().then(courses => {
            resolve(courses);
        })
        .catch(error=>{
            reject("No results returned");
        })
    })
}

const getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where:{
                courseId:id
            }
        }).then(courses=>{
            resolve(courses);
        }).catch(err=>{
            reject("No results returned");
        })
    })
}

const getStudentsByNum = (num) => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:{
                studentNum:num
            }
        }).then(student=>{
            resolve(student);
        }).catch(err=>{
            reject("No results returned");
        })
    })
}

const addStudent = (studentData) => {
    studentData.TA = (studentData.TA) ? true : false;
    for (const key in studentData) {
        if (studentData.hasOwnProperty(key) && studentData[key] === "") {
            studentData[key] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Student.create(studentData)
        .then((createdStudent) => {
            resolve(createdStudent);
        }).catch(err=>{
            reject('unable to create student');
        })
    })
}

const updateStudent = (studentData) => {
    console.log("studentData:", studentData);
    studentData.TA = (studentData.TA) ? true : false;
    for (const key in studentData) {
        if (studentData.hasOwnProperty(key) && studentData[key] === "") {
            studentData[key] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Student.update(studentData, {
            where: { studentNum: Number(studentData.studentNum) }
        })
            .then((updateStudent) => {
                resolve(updateStudent);
            })
            .catch(err => {
                reject(err);
            });
    });
};


const addCourse = (courseData) => {
    for (const key in courseData) {
        if (courseData.hasOwnProperty(key) && courseData[key] === "") {
            courseData[key] = null;
        }
    }
    return new Promise((resolve,reject)=>{
        Course.create(courseData)
        .then((createdCourse) => {
            resolve(createdCourse);
        }).catch(err=>{
            reject('unable to create course');
        })
    })
}

const updateCourse = (courseData) => {
    for (const key in courseData) {
        if (courseData.hasOwnProperty(key) && courseData[key] === "") {
            courseData[key] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Course.update({ courseId: courseData.courseId }, courseData)
        .then((updateCourse) => {
            resolve(updateCourse);
        }).catch(err=>{
            reject('unable to update course');
        })
    })
}

const deleteCourseById = (id) => {
    return new Promise((resolve,reject)=>{
        Course.destroy({
            where: {
                courseId: id
            }
        })
        .then((deletedRows) => {
            if (deletedRows > 0) {
                resolve(`Course with ID ${id} deleted successfully`);
            } else {
                reject(`Course with ID ${id} not found`);
            }
        })
        .catch((error) => {
            reject(`Error deleting course with ID ${id}: ${error.message}`);
        });
    })
}

const deleteStudentByNum = (num) => {
    return new Promise((resolve,reject)=>{
        Student.destroy({
            where: {
                studentNum: num
            }
        })
        .then((deletedRows) => {
            if (deletedRows > 0) {
                resolve(`Student with ID ${num} deleted successfully`);
            } else {
                reject(`Student with ID ${num} not found`);
            }
        })
        .catch((error) => {
            reject(`Error deleting student with ID ${num}: ${error.message}`);
        });
    })
}

module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getStudentsByCourse,
    getStudentsByNum,
    addStudent,
    getCourseById,
    updateStudent,
    addCourse,
    updateCourse,
    deleteCourseById,
    deleteStudentByNum
};