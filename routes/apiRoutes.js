// Node Modules
const fs = require('fs')
// const path = require('path')
const uuid = require('../helpers/uuid')
const router = require('express').Router()

// API Routes
// GET Route for /api/notes
router.get('/api/notes', (req, res) => {
    const notesData = JSON.parse(fs.readFileSync('../db/db.json', 'utf8'))
    res.json(notesData)
})

// POST Route for /api/notes
router.post('/api/notes', (req, res) => {
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
            id: uuid(),
        }


        // Read current saved notes
        const readNotes = fs.readFileSync('../db/db.json', 'utf8')

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
router.get('/api/notes/:id', (req, res) => {
    const requestID = req.params.id
    const readNotes = fs.readFileSync('../db/db.json', 'utf8')
    const parsedNotes = JSON.parse(readNotes);
    // Iterate through the terms name to check if it matches `req.params.note_id`
    console.log('PARSEDNOTES NOTES LENGTH:', parsedNotes.length)
    console.log('REQUESTED TERM IS:', requestID)

    if (requestID) {
        console.info(`${req.method} request received to get a single a review`);
        for (let i = 0; i < parsedNotes.length; i++) {
            const currentID = parsedNotes[i]
            if (currentID.id === requestID) {
                return res.json(currentID);
            }
        }
    }
    // Return a message if the term doesn't exist in our DB
    return res.json('No term found');

})

// DELETE Route for ID
router.delete('/api/notes/:id', (req, res) => {
    const deleteID = req.params.id
    const readNotes = fs.readFileSync('../db/db.json', 'utf8')
    const parsedNotes = JSON.parse(readNotes);
    // Iterate through the terms name to check if it matches `req.params.note_id`
    console.log('PARSEDNOTES NOTES LENGTH:', parsedNotes.length)
    console.log('REQUESTED TERM IS:', deleteID)

    if (deleteID) {
        console.info(`${req.method} request received to get a single a review`);
        for (let i = 0; i < parsedNotes.length; i++) {
            const currentID = parsedNotes[i]
            if (currentID.id === deleteID) {
                const indexID = parsedNotes.indexOf(currentID)
                parsedNotes.splice(indexID, 1)
                // Write new notes back to the file
                fs.writeFileSync(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                );

            }
        }
    }
    // Return a message if the term doesn't exist in our DB
    return res.json('No term found');

})

// Export module
module.exports = router;

