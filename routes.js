const express = require('express');
const userObj = require('./users');
var uuid = require('uuid');

const router = express.Router()

//Get all Method
router.get('/users', async (req, res) => {
    try {
        if (!userObj || userObj.length === 0) {
            return res.status(404).json({
                success: false,
                data: "Users not found!"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
        })
    }
    return res.status(200).json({
        message: "Users retrieved",
        success: true,
        users: userObj
    })
})

//Update by ID Method
router.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    let userFound = false;
    try {
        if (Object.keys(body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Incorrect request body. Required fields: email and/or firstName"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
    userObj.forEach((user) => {
        if (user.id === id) {
            userFound = true;
            if (body.email) user.email = body.email;
            if (body.firstName) user.firstName = body.firstName;
        }
    })
    if (!userFound) {
        return res.status(404).json({
            success: false,
            message: "User not found!"
        })
    }
    return res.status(200).send({
        message: "User updated",
        success: true
    })
})

//Post Method
router.post('/add', async (req, res) => {
    const body = req.body;
    const id = uuid.v4();
    try {

        if (Object.keys(body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Incorrect request body. Required fields: email, firstName"
            })
        } else if (!req.body.email) {
            return res.status(400).json({
                success: false,
                message: "Incorrect request body. Required fields: email"
            })
        } else if (!req.body.firstName) {
            return res.status(400).json({
                success: false,
                message: "Incorrect request body. Required fields: firstName"
            })
        } else {
            body.id = id;
            userObj.push(body);
        }
    }
    catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error"
        });
    }
    return res.status(200).send({
        message: "User added",
        success: true,
        id: id
    })
})

//Get by ID Method
router.get('/user/:id', async (req, res) => {
    try {
        if (!userObj || userObj.length === 0) {
            return res.status(404).json({
                success: false,
                data: "Users not found!"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
        })
    }
    const id = req.params.id;
    let userFound = false;
    userObj.forEach((user) => {
        if (user.id === id) {
            userFound = true;
            return res.status(200).json({
                success: true,
                data: {
                    email: user.email,
                    firstName: user.firstName,
                    id: user.id
                }
            })
        }
    })
    if (!userFound) {
        return res.status(404).json({
            success: false,
            message: "User not found!"
        })
    }
})


// 404 error handler
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Requested URL not found - ${req.originalUrl}`
    });
};

// Attach the not found handler middleware
router.use(notFoundHandler);

module.exports = router