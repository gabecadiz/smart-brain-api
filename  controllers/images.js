const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '435e8439ba8e4e648fd5eaa950be0217'
});

const handleApiCallPOST = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'));
};

const handleImagesPUT = (req, res, db) => {
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
};

module.exports = {
  handleImagesPUT,
  handleApiCallPOST
};
