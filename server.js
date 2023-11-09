/********************************************************************************** 
 * WEB700 – Assignment 4
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.
 * Name: Mingyuan Xie Student ID:117518225  Date: 2023-10-01
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
                res.render('students',{student:data})
            }).catch(error => {
                res.render("students", {message: "no results"});
            })
    } else {
        collegeData.getAllStudents().then(data => {
            res.render('students',{student:data})
        }).catch(error => {
            res.render("students", {message: "no results"});
        })
    }
})

app.get("/students/:num", (req, res) => {
    const num = parseInt(req.params.num);
    if(num){
        collegeData.getStudentsByNum(num).then(data => {
            res.render('students',{student:data});
        }).catch(error => {
            res.render("students", {message: "no results"});
        })
    }else{
        res.render("students", {message: "no results"});
    }
})

app.get("/student/add", (req, res) => {
    res.render('addStudent',{layout:'main'});
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(data=>{
        console.log('Received response:', data);
        return res.json(data);
    }).catch(error=>{
        res.send(error.message);
    })
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body).then(data=>{
        res.redirect("/students");
    })
});

app.get("/student/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    collegeData.getStudentsByNum(studentId).then((data)=>{
        res.render('student',{student:data});
    })
});

app.get("/tas", (req, res) => {
    collegeData.getTAs().then(data => {
        res.json(data);
    }).catch(error => {
        res.status(500).json({ message: "no results" });
    })
})

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data => {
        res.render('courses',{course:data})
    }).catch(error => {
        res.render("courses", {message: "no results"});
    })
})

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



app.get('/course/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    console.log("id=",id);
    collegeData.getCourseById(id).then((data,index)=>{
        res.render('course',{course:data});
    }).catch(err=>{
        res.render("course", {message: "no results"});
    })
})

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});







