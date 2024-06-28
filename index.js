const express 	    = require('express');
//const i18n        = require("i18n");
const compression   = require('compression')
const morgan 	    = require('morgan');
const bodyParser 	= require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
var LOG             = require('./config/logger');
const path          = require('path');
const app           = express(); 
const CONFIG        = require('./config/config');
const routes        = require('./app/routes-index');
const fetch         = require('cross-fetch');

const { connectiondb } = require('./app/db/connectiondb.js');
const cookieParser = require('cookie-parser');


globalThis.fetch = fetch;

//app.use(i18n.init);
//app.use(logger('dev'));
app.use(morgan('combined', { stream: LOG.stream }));
app.use(bodyParser.json({limit:"5mb"}));
app.use(bodyParser.urlencoded({ extended: false }));

//Passport
app.use(passport.initialize());
app.use(compression())
//Log Env
console.log("Environment:", CONFIG.app)

app.set("trust proxy",1)


// CORS  using for testing local 
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,",
    Credential: true,
}))

app.use(function(req, res, next) {
    var originalUrl = req.originalUrl;
    var method = req.method;
    console.log(req.path)
    var contentType = req.headers['content-type'];
    var contentType="application/json"
    let path = req.path;
    if( // path.indexOf('common/uploadFile') < 0 && //* any path that uses form-data should be excluded here
        contentType != 'application/json'){
        res.status(415);
        res.json({
            error: 'Unsupported Content-Type.',
            success: false
        });
    }else{
        next();
    }
});


app.use(cookieParser());

connectiondb()

routes.v1routes(app)

app.use('/', function(req, res){
	res.status(500).json({message:`${CONFIG.APP_NAME} API Server`})
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Requested resource not found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    LOG.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    res.json({
        message: err.message,
        error: err
    });
});

// module.exports = app;
const httpServer=app.listen(CONFIG.port, err => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`${CONFIG.APP_NAME} API Server is listening on %s`, CONFIG.port);
});


//This is here to handle all the uncaught promise rejections
app.on('unhandledRejection', error => {
    console.log(error)
    console.error('Uncaught Error', pe(error));
});

//#####################################################

//app.use(express.urlencoded({ extended: true }))
//app.use(express.json());

