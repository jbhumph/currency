if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())

app.use(express.static('public'));

// set appropriate security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "https://v6.exchangerate-api.com", "http://localhost:3000/"],
        }
    }
}));

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

// users array
const users = [];

// declare static folder
//app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/send', (req, res) => {
    res.render('pages/send');
});

app.get('/converter', (req, res) => {
    res.render('pages/converter', { tab: "converter" });
});

app.get('/sending', (req, res) => {
    res.render('pages/converter', { tab: "send" });
});

app.get('/chart', (req, res) => {
    res.render('pages/converter', { tab: "chart" });
});

app.get('/alert', checkAuthenticated, (req, res) => {
    res.render('pages/converter', { tab: "alert", name: req.user.name });
});

app.get('/api', (req, res) => {
    res.render('pages/api');
});

app.get('/tools', (req, res) => {
    res.render('pages/tools');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});



// post methods
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register');
    }
    console.log(users);
})


// catch for 404
app.use((req, res, next) => {
    res.status(404).render('pages/404');
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}


// serve
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

