const express = require('express');
const Model = require('./model');

const router = express.Router()

//Get all Method
router.get('/users', async (req, res, next) => {
    try {
        const data = await Model.find();
        res.status(200).json({
            message: "Users retrieved",
            success: true,
            users: data
        })
    }
    catch (error) {
        next({
            message: error.message,
            statusCode: 500,
        })
    }
})

//Update by ID Method
router.put('/update/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.status(200).send({
            message: "User updated",
            success: true,
            user: result
        })
    }
    catch (error) {
        next({
            statusCode: 400,
            message: error.message
        });
    }
})

//Post Method
router.post('/add', async (req, res, next) => {
    const data = new Model({
        firstName: req.body.firstName,
        email: req.body.email
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json({
            message: "User added",
            success: true,
            user: dataToSave
        })
    }
    catch (error) {
        next({
            statusCode: 400,
            message: error.message
        });
    }
})

//Get by ID Method
router.get('/user/:id', async (req, res, next) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json({
            success: true,
            user: data
        })
    }
    catch (error) {
        next({
            statusCode: 500,
            message: error.message
        });
    }
})


// 404 error handler
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Attach the not found handler middleware
router.use(notFoundHandler);

// Error handling middleware
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
    }

    res.status(statusCode).json({
        message: message,
        success: false
    });
};

// Attach the error handler middleware
router.use(errorHandler);

module.exports = router