/********************************************************************************** 
 * WEB700 – Assignment 5
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.
 * Name: Mingyuan Xie Student ID:117518225  Date: 2023-11-16
********************************************************************************/

const exphbs = require('express-handlebars');
const collegeData = require("./modules/collegeData");
var path = require("path");


collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on port" + HTTP_PORT)
    });
}).catch((error) => {
    console.log(error);
})

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));next();
})
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.engine('.hbs', exphbs.engine({ 
        extname: '.hbs', 
        defaultLayout: 'main',
        helpers: {
            navLink: function(url, options){
                return `
                    <li class="nav-item">
                        <a class="nav-link ${url == app.locals.activeRoute ? "active" : "" }"href="${url}">
                            ${options.fn(this)}
                        </a>
                    </li>
                `;
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } 
                else {
                    return options.fn(this);
                }
            }
        }
    })
);
app.set('view engine', '.hbs');

app.get("/students", (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(course)
            .then((data) => {
                if(data.length > 0){
                    res.render('students',{student:data})
                }else{
                    res.render("students",{ message: "no results" });
                }
            }).catch(error => {
                res.status(500).json({ message: "no results" });
            })
    } else {
        collegeData.getAllStudents().then(data => {
            if(data.length > 0){
                res.render('students',{student:data})
            }else{
                res.render("students",{ message: "no results" });
            }
        }).catch(error => {
            console.log("error:",error);
            res.status(500).json({ message: error.message });
        })
    }
})

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data => {
        if(data.length > 0){
            res.render('courses',{courses:data})
        }else{
            res.render("courses",{ message: "no results" });
        }
    }).catch(error => {
        res.status(500).json({ message: error.message });
    })
})

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(data=>{
        console.log('Received response:', data);
        res.redirect("/students");
    }).catch(error=>{
        res.send(error.message);
    })
});

app.get("/student/add", (req, res) => {
    collegeData.getCourses().then(data=>{
        res.render('addStudent',{courses:data});
    }).catch(err=>{
        res.render('addStudent',{courses:[]});
    })
});

app.get("/students/:studentNum", (req, res) => {
    // Initialize an empty object to store the values
    let viewData = {};

    // Get student data by student number
    collegeData.getStudentsByNum(req.params.studentNum)
        .then((studentData) => {
            if (studentData) {
                // Store student data in the "viewData" object as "student"
                console.log("in???");
                viewData.student = studentData;
            } else {
                // Set student to null if none were returned
                viewData.student = null;
            }
        })
        .catch((err) => {
            // Set student to null if there was an error
            viewData.student = null;
        })
        .then(() => {
            // Get courses data
            return collegeData.getCourses();
        })
        .then((coursesData) => {
            // Store course data in the "viewData" object as "courses"
            viewData.courses = coursesData;

            // Loop through viewData.courses and add a "selected" property
            // to the matching viewData.courses object
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        })
        .catch((err) => {
            // Set courses to empty if there was an error
            viewData.courses = [];
        })
        .then(() => {
            if (viewData.student == null) {
                // If no student - return an error
                res.status(404).send("Student Not Found");
            } else {
                // Render the "student" view
                // console.log("viewDatasssss",.firstName);
                res.render("student", { student: viewData.student[0],courses:viewData.courses });
            }
        });
});

app.post("/student/update", (req, res) => {
    console.log("in /student/update?");
    collegeData.updateStudent(req.body).then(data=>{
        res.redirect("/students");
    })
});

app.get("/", (req, res) => {
    res.render('home', {
        layout: 'main' // do not use the default layout (main.hbs)
    });
});

app.get("/about", (req, res) => {
    res.render('about', {
        layout: 'main' // do not use the default layout (main.hbs)
    });
});

app.get("/htmlDemo", (req, res) => {
   res.render('htmlDemo',{layout:'main'});
});

app.get('/course/add',(req,res)=>{
    console.log("in???");
    res.render('addCourse',{layout:'main'});
});

app.post('/course/add',(req,res)=>{
    collegeData.addCourse(req.body).then(data=>{
        console.log('Received response:', data);
        res.redirect("/courses");
    }).catch(error=>{
        res.send(error.message);
    })
});

app.get('/course/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    console.log("in:id??=",id);
    collegeData.getCourseById(id).then((data,index)=>{
        if(data){
            console.log("data:",data);
            res.render('course',{course:data[0]});
        }else{
            res.status(404).send("Course Not Found")
        }
    }).catch(err=>{
        res.status(500).json({ message: err.message});
    })
});

app.post('/course/update',(req,res)=>{
    collegeData.updateCourse(req.body).then(data=>{
        res.redirect("/courses");
    })
});

app.get('/course/delete/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    collegeData.deleteCourseById(id).then(data=>{
        res.redirect("/courses");
    }).catch(err=>{
        res.status(500).send('Unable to Remove Course / Course not found)');
    })
});

app.get('/student/delete/:studentNum',(req,res)=>{
    const num = parseInt(req.params.studentNum);
    collegeData.deleteStudentByNum(num).then(data=>{
        res.redirect("/students");
    }).catch(err=>{
        res.status(500).send(err);
    })
});

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});







