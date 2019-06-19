const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./ controllers/register');
const signin = require('./ controllers/signin');
const profile = require('./ controllers/profile');
const images = require('./ controllers/images');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'computer',
    password: '',
    database: 'smart-brain'
  }
});

//json parser middleware from express
app.use(express.json());
//cors middleware
app.use(cors());

app.get('/', (req, res) => {
  res.send(database);
});

app.post('/signin', (req, res) => {
  signin.handleSigninPOST(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegisterPOST(req, res, db, bcrypt, saltRounds);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGET(req, res, db);
});

app.put('/images', (req, res) => {
  images.handleImagesPUT(req, res, db);
});

app.post('/imagesurl', (req, res) => {
  images.handleApiCallPOST(req, res, db);
});

app.listen(3003, () => {
  console.log('app is running on port 3003');
});
