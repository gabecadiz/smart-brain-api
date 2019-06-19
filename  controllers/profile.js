const handleProfileGET = (req, res, db) => {
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
};

module.exports = {
  handleProfileGET
};
