const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the MuoVivio chat library. Please talk quietly.')
});

module.exports = router;