// Node Modules
const fs = require('fs')
const path = require('path')
const express = require('express')
const uuid = require('uuid')
const app = express();

// Middleware for parsing JSON and URLencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PORT Info
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

// GET Route for notes.html
app.get(`/notes`, (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// GET Route for index.html
app.get(`*`, (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)



