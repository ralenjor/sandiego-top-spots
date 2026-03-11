// import files and packages up here
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// create your express server below
const app = express();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/data', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8');
    res.json(JSON.parse(data));
});


// add your routes and middleware below

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// finally export the express application
module.exports = app;
