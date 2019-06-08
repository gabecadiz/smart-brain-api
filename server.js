const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');

//json parser middleware from express
app.use(express.json());
//cors middleware
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sal',
      email: 'sally@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get('/', (req, res) => {
  res.send(database);
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // let passCheck = bcrypt.compareSync(password, database.users[2].password); // true
  //temporarily not using bcrypt for post signin
  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
    database.users.push({
      id: '125',
      name: name,
      email: email,
      password: hash,
      entries: 0,
      joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
  });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json('user not found');
  }
});

app.put('/images', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('user not found');
  }
});

app.listen(3003, () => {
  console.log('app is running on port 3003');
});
