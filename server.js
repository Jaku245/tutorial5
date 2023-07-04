const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const mongoString = "mongodb+srv://Jaimin:jaku2430@cluster0.n9nc6.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(express.json());

app.use('/api', routes)

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})