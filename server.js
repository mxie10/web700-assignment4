/********************************************************************************** 
 * WEB700 – Assignment 3
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.
 * Name: Mingyuan Xie Student ID:117518225  Date: 2023-10-01
********************************************************************************/

const { error } = require("console");
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

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get("/students", (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(course)
            .then((data) => {
                res.json(data);
            }).catch(error => {
                res.status(500).json({ message: "no results" });
            })
    } else {
        collegeData.getAllStudents().then(data => {
            res.json(data)
        }).catch(error => {
            res.status(500).json({ message: "no results" })
        })
    }
})

app.get("/tas", (req, res) => {
    collegeData.getTAs().then(data => {
        res.json(data);
    }).catch(error => {
        res.status(500).json({ message: "no results" });
    })
})

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data => {
        res.json(data);
    }).catch(error => {
        res.status(500).json({ message: "no results" });
    })
})

app.get("/students/:num", (req, res) => {
    const num = parseInt(req.params.num);
    if(num){
        collegeData.getStudentsByNum(num).then(data => {
            res.json(data);
        }).catch(error => {
            res.status(500).json({ message: "no results" });
        })
    }else{
        res.status(500).json({ message: "no results" });
    }
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'views','home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,'views','about.html'));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname,'views','htmlDemo.html'));
});

app.get("/student/add", (req, res) => {
    res.sendFile(path.join(__dirname,'views','addStudent.html'));
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(data=>{
        console.log('Received response:', data);
        return res.json(data);
    }).catch(error=>{
        res.send(error.message);
    })
});

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});







