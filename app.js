const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose') 
const morgan = require('morgan')
const connectDB = require('./config/db');
const exphbs = require('express-handlebars')
const passport = require('passport');
const session = require('express-session')
//const methodOverride = require('method-override')

const methodOverride = require('method-override')
const mainRouter = require('./routes/index');
const auth = require('./routes/auth');
const storiesRouter = require('./routes/newStories');




// loading the config
dotenv.config({path: './config/config.env'});

// passprot confin
require('./config/passport')(passport)

connectDB();

const app = express();

// body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json())

// method override
app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body == 'object' && '_method' in req.body){
        // look in URLencodded POST bodies  and delelet it
        let method = req.body._method
        delete req.body._method
        return method 
    }
}))

if(process.env.NODE_ENV === 'developement'){
    app.use(morgain('dev'))
}

// handlebarz helpers
const {formatDate, scriptTags, truncate, editIcon, select } = require('./helpers/hbs')

// initiating handlebarz
app.engine('.hbs', exphbs({ helpers: {
    formatDate,
    truncate,
    scriptTags,
    editIcon,
    select
    }
    , defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

// sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false, // no need to save a seesion if noting is modeified
    saveUninitialized: false, // don't store someting utl some ing is sore
 //   store: new MongoStore({moongoseConnection: mongoose.connection})
}))


// passport middlware
app.use(passport.initialize())
app.use(passport.session())

// set a gloab variable

app.use(function(req,res, next){
    res.locals.user = req.user || null 
    next()
})


// static folder
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', mainRouter);
app.use('/auth', auth);
app.use('/stories', storiesRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log('server is running....'))