var mongoose = require('mongoose');
var Employee = require("../models/Employee");

var employeeController = {};

// show list
employeeController.list = function(req, res) {
    Employee.find({}).exec(function(err, employees) {
        if(err) {
            console.log(err);
        } else {
            res.render("../views/employee/index", {employees: employees});
        }
    });
};

//show item
employeeController.show = function(req, res) {
    Employee.findOne({_id: req.params.id}).exec(function(err, employee) {
        if(err) {
            console.log(err);
        } else {
            res.render("../views/employee/show", {employee: employee});
        }
    });
};

// create form
employeeController.create = function(req, res) {
    res.render("../views/employee/create");
};

//save
employeeController.save = function(req, res) {
    //res.send(req.body);
    var employee = new Employee(req.body);
    employee.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("create success");
            res.redirect("/employees/show/"+employee._id);
        }
    })
}

//edit
employeeController.edit = function(req, res) {
    Employee.findOne({_id: req.params.id}).exec(function(err, employee) {
        if(err) {
            console.log("error:", err);
        } else {
            res.render("../views/employee/edit", {employee: employee});
        }
    });
};

//update form
employeeController.update = function(req, res) {
    Employee.findByIdAndUpdate(req.params.id,
        {$set: {name: req.body.name,
            address: req.body.address,
            possition: req.body.possition,
            salary: req.body.salary}},
        {new: true},
        function(err, employee){
            if(err) {
                console.log(err);
                res.render("../views/employees/edit", {employee: employee});
            } else {
                res.redirect("/employees/show/"+employee._id);
            };
        });
};

//delete
employeeController.delete = function(req, res) {
    Employee.remove({_id: req.params.id}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("employee delete");
            res.redirect("/employees");
        }
    })
};

module.exports = employeeController;

