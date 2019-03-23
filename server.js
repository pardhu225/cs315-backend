const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require('path');
const fs = require('fs');
const cparser = require('cookie-parser');
const cors = require('cors');

const session = require("express-session");
//Config
let config = require("./config");

//Routes
let routes = require("./routes");

const app = express();
const port = 60000; //port on which server runs


//enable POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cparser());

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream })); // log every request to the console
app.use(morgan('dev'));

app.use('/', routes);

app.listen(port, function () {
    console.log("Server listening on port", port);
});
