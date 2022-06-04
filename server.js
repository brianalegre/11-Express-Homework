// Node Modules
const fs = require('fs')
const path = require('path')
const express = require('express')
const uuid = require('./helpers/uuid')
const app = express();
// const process = require('process');
// const { json } = require('express/lib/response');

// Middleware for parsing JSON and URLencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PORT Info
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

// Variables
// const notesData = require('./db/db.json');
// const req = require('express/lib/request');

// GET Route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// GET Route for /api/notes
app.get('/api/notes', (req, res) => {
    const notesData = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    res.json(notesData)
})

// POST Route for /api/notes
app.post('/api/notes', (req, res) => {
    // Log POST received
    console.log(`${req.method} request recieved to add to notes`)
    console.log("Current working directory!!!!!!!!!!!!:", process.cwd())

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
        const readNotes = fs.readFileSync('./db/db.json', 'utf8')

        // Convert string into JSON object
        const parsedNotes = JSON.parse(readNotes);

        // Add a new review
        parsedNotes.push(newNote);
        console.log(`Hello this is brian`)
        // Write new notes back to the file
        fs.writeFileSync(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
        );

        // Response Status
        const response = {
            status: 'Succcess',
            body: newNote,
        }
        console.log(`Hello this is chad`)
        // Send response status
        res.status(201).json(response)
    } else {
        res.status(500).json('Error in POST')
    }
})

// Bonus
// GET route for ID
// Testing call for ID
app.get('/api/notes/:note_id', (req, res) => {
    const requestedTerm = req.params.note_id
    const readNotes = fs.readFileSync('./db/db.json', 'utf8')
    const parsedNotes = JSON.parse(readNotes);
    // Iterate through the terms name to check if it matches `req.params.term`
    console.log('PARSEDNOTES NOTES LENGTH:', parsedNotes.length)
    console.log('READ NOTES------:', readNotes)
    console.log('REQUESTED TERM IS:', requestedTerm)

    if (requestedTerm) {
        for (let i = 0; i < parsedNotes.length; i++) {
            if (requestedTerm === parsedNotes[i]) {
                return res.json(parsedNotes[i]);
            }
        }
    }


    // Return a message if the term doesn't exist in our DB
    return res.json('No term found');

})


// GET Route for index.html
// Needs to be last
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

// To try later:
// readAndAppend(newTip, './db/tips.json');
// res.json(`Tip added successfully 🚀`);
// } else {
// res.error('Error in adding tip');
// }

// Lookup nanoid
// Nick says its better than UUID