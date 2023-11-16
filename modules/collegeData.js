let courses = require("../data/courses.json");
let students = require("../data/students.json");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null;

const initialize = () => {
    dataCollection = new Data(students, courses);
    return new Promise((resolve, reject) => {
        try {
            resolve(dataCollection)
        } catch (e) {
            reject(e)
        }
    })
}

const getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject(new Error('no results returned'));
        }
    })
}

const getTAs = () => {
    let studentsWithTA = [];
    students.forEach(student => {
        if (student.TA === true) {
            studentsWithTA.push(student);
        }
    });
    return new Promise((resolve, reject) => {
        if (studentsWithTA.length > 0) {
            resolve(studentsWithTA);
        } else {
            reject('"no results returned');
        }
    })
}

const getCourses = () => {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses && dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject(new Error('no results returned'));
        }
    })
}

const getStudentsByCourse = (course) => {
    return new Promise((resolve, reject) => {
        try{
            const filteredStudents = students.filter((student,index)=> {
                return student.course.toString() === course
            })
            if(filteredStudents.length !== 0){
                resolve(filteredStudents);
            }else{
                reject("no result returned");
            }
        }catch(e){
            return new Error(e)
        }
    })
}

const getStudentsByNum = (num) => {
    return new Promise((resolve, reject) => {
        try{
            const student = students.find((student,index)=> student.studentNum === num);
            if(student.length !== 0){
                resolve(student);
            }else{
                reject("no result returned");
            }
        }catch(e){
            return new Error(e)
        }
        
    })
}

const addStudent = (params) => {
    console.log(params);
    return new Promise((resolve,reject)=>{
        try{
            let studentNum = dataCollection.students.length + 1;
            let firstName = params.firstName;
            let lastName = params.lastName;
            let email = params.email;
            let addressStreet = params.address_street;
            let addressCity = params.address_city;
            let addressProvince = params.address_province;
            let isTeachingAssistant = params.ta;
            let enrollmentStatus = params.status;
            let selectedCourse = params.select_courses;

            if(params.ta === undefined){
                isTeachingAssistant = false;
            }else{
                isTeachingAssistant = true;
            }

            let newStudentObject = {
                "studentNum": studentNum,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "addressStreet": addressStreet,
                "addressCity": addressCity,
                "addressProvince": addressProvince,
                "TA": isTeachingAssistant,
                "status": enrollmentStatus,
                "course": selectedCourse
            }

            dataCollection.students.push(newStudentObject);
            resolve("Now in dataCollection there is " + dataCollection.students.length + " students.");
        }catch(e){
            reject(e);
        }
    })
}

const updateStudent = (params) => {
    console.log("params.ta",typeof(params.ta));
    return new Promise((resolve,reject)=>{
        try{
            let studentNum = parseInt(params.studentNum);
            let firstName = params.firstName;
            let lastName = params.lastName;
            let email = params.email;
            let addressStreet = params.address_street;
            let addressCity = params.address_city;
            let addressProvince = params.address_province;
            let isTeachingAssistant = params.ta;
            let enrollmentStatus = params.status;
            let selectedCourse = params.select_courses;

            if(params.ta === undefined){
                isTeachingAssistant = false;
            }else{
                isTeachingAssistant = true;
            }

            const updatedStudent = students.find((student)=>{
                return student.studentNum === studentNum;
            })

            updatedStudent.firstName = firstName;
            updatedStudent.lastName = lastName;
            updatedStudent.email = email;
            updatedStudent.addressStreet = addressStreet;
            updatedStudent.addressCity = addressCity;
            updatedStudent.addressProvince = addressProvince;
            updatedStudent.TA = isTeachingAssistant;
            updatedStudent.status = enrollmentStatus;
            updatedStudent.course = selectedCourse;

            resolve();
        }catch(e){
            reject(e);
        }
    })
}

const getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        try{
            const course = courses.find((course,index)=> course.courseId === id);
            if(course.length !== 0){
                console.log('has data');
                resolve(course);
            }else{
                reject("no result returned");
            }
        }catch(e){
            return new Error(e)
        }
    })
}

module.exports = {
    dataCollection,
    initialize,
    getAllStudents,
    getTAs,
    getCourses,
    getStudentsByCourse,
    getStudentsByNum,
    addStudent,
    getCourseById,
    updateStudent
};