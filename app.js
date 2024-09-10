/////// app.js

const { Pool } = require('pg');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.render('index'));
app.get('/sign-up', (req, res) => res.render('sign-up-form'));

app.post('/sign-up', async (req, res, next) => {
  try {
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
      req.body.username,
      req.body.password,
    ]);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app listening on port ${port}!`));
