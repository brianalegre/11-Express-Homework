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

// Call Routes
app.use("/", htmlRoutes);
app.use("/", apiRoutes);


// To try later:
// readAndAppend(newTip, './db/tips.json');
// res.json(`Tip added successfully 🚀`);
// } else {
// res.error('Error in adding tip');
// }

// Lookup nanoid
// Nick says its better than UUID