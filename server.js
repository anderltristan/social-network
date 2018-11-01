const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');
// Newer version of mongo suggests using new parser
const mongoUpdate = {
    useNewUrlParser: true
};

// Creating instance of express app
const app = express();
// Loading middleware from body-parser package
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Loading middelware from passport
app.use(passport.initialize());
require('./config/passport.js')(passport);
// Getting the mLAB URI from config directory
const db = require('./config/keys').mongoURI;

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

require("./models/user");

// Loading route middleware
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Serving to production
if (process.env.NODE_ENV === 'production') {
    // Setting static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Setting up port for heroku deployment, using 5000 for local development
const PORT = process.env.PORT || 5000;

// Starting the server on PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});