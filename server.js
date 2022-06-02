// Node Modules
const fs = require('fs')
const path = require('path')
const express = require('express')
const uuid = require('./helpers/uuid')
const app = express();

// Middleware for parsing JSON and URLencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PORT Info
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

// Variables
const notesData = require('./db/db.json');
// const req = require('express/lib/request');

// GET Route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// GET Route for /api/notes
app.get('/api/notes', (req, res) =>
    res.json(notesData)
)

// POST Route for /api/notes
app.post('/api/notes', (req, res) => {
    // Log POST received
    console.log(`${req.method} request recieved to add to notes`)

    // Deconstruct
    const { title, text } = req.body;

    // Check if all keys are populated
    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        }


        // Read current saved notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated Notes!')
                );
            }
        });

        // Response Status
        const response = {
            status: 'Succcess',
            body: newNote,
        }

        // Send response status
        res.status(201).json(response)
    } else {
        res.status(500).json('Error in POST')
    }
})

// GET Route for index.html
// Needs to be last
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)