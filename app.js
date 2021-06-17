const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

const db = require('./database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.NODE_ENV !== 'production') {
    app.enable('trust proxy');
}

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(require('compression')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    secret: '7w4TxI$"&fbUNxI$"&fQqX5Rdfsgsdpenesgr5DbCWz',
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: db.url,
        collection: 'sessions'
    })
}));
app.use(require('flash')());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/login'));
app.use('/server', require('./routes/server'));
app.use('/search', require('./routes/search'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    res.locals.debug = req.app.get('env') === 'development';

    console.log(require('util').inspect(err));

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Error ' + (err.status || 500), user: req.user });
});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

module.exports = app;
