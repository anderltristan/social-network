const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');
// Newer version of mongo suggests using new parser
const mongoUpdate = {
    useNewUrlParser: true
};

// Creating instance of express app
const app = express();
// Setting up port for heroku deployment, using 5000 for local development
const PORT = process.env.PORT || 5000;
// Getting the mLAB URI from config directory
const db = require('./config/keys').mongoURI;

// Starting the server on PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Connection to the mLAB db using mongodb connection method
// .connect(database, options)...
mongoose.connect(db, mongoUpdate).then(() => {
    // .connect() accepts callback paramter and returns a promise
    // 'mongoose.connect()' promise resolves to undefined here
    console.log("Succesfully connected to mLAB db")
}).catch((err) => {
    // handles connection error
    console.log(`Problem connecting to mLAB db\nError: ${err}`);
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.get('/', (req, res) => {
    res.send('Hello');
});