const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./ controllers/register');

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
  const { email, password } = req.body;

  db.select('email', 'hash')
    .from('login')
    .where({ email })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where({ email })
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => {
            res.status(400).json('unable to get user');
          });
      } else {
        res.status(400).json('error logging in - wrong credentials');
      }
    })
    .catch(err => {
      res.status(400).json('error logging in - wrong credentials');
    });
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      //if no user is found, empty array is returned. Therefore user.length is used to determine successful/unsuccessful query
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('user not found');
      }
    })
    .catch(err => {
      res.status(400).json('error finding user');
    });
});

app.put('/images', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => {
      res.status(400).json('unable to put entries');
    });
});

app.listen(3003, () => {
  console.log('app is running on port 3003');
});
