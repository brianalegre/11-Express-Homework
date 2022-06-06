// Node Modules
const express = require('express')
const app = express();

// Import Routes
const router = require('./routes/apiRoutes')
const router = require('./routes/htmlRoutes')

// Middleware for parsing JSON and URLencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PORT Info
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

// Call Routes
app.use("/", router);
app.use("/", router);


// To try later:
// readAndAppend(newTip, './db/tips.json');
// res.json(`Tip added successfully 🚀`);
// } else {
// res.error('Error in adding tip');
// }

// Lookup nanoid
// Nick says its better than UUID