var express = require('express');
var path = require('path');
var cors = require('cors');

var allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',  // Vue
    'http://127.0.0.1:5173',  // Vue
];

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var teamsRouter = require('./routes/teams');
var playersRouter = require('./routes/players');

var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);    if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }    return callback(null, true);
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/players', playersRouter);

module.exports = app;


/* HOURS SPENT ON PROJECT
    Friday  2023/03/10
        2.5 : Reading Project requirements & browsing libraries documentations
    Monday  2023/03/13
        3   : Start Projects (Βe/Fe separately) and DB setup (Using WebStorm as IDE)
    Tuesday 2023/03/14
        4   : Be | Users + Register Login & Teams (no 2FA but with prediction) +
* */