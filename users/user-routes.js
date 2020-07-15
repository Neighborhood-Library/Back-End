const express = require('express');
const User = require('./user-models.js');

const router = express.Router();

// Get user
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userInfo = await User.getUserById(id);

    if (userInfo.length > 0) {
      res.status(200).json(userInfo[0]);
    } else {
      res.status(404).json({
        message: 'User not found'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Create user
// router.post('/', async (req, res) => {
//   const user = req.body;

//   console.log(user);

//   if(user.user_identity === undefined) {
//     user.user_identity = 'muoVivlio';
//   }

//   try {
//     if (user.user_name && user.user_email && user.user_identity && user.user_credential) {
//       const addUser = await User.addUser(user);
  
//       if (addUser) {
//         res.status(201).json({
//           message: "User created"
//         });
//       }
//     } else {
//       res.status(400).json({
//         message: 'All required fields not found.'
//       });
//     } 
//   } catch (err) {
//     res.status(500).json({
//       error: err.detail
//     });
//   }
// });

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const info = req.body;

  try {
    const updateUser = await User.updateUser(info, id);

    if (updateUser) {
      res.status(200).json({
        message: 'User updated'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Deletes user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userExists = await User.getUserById(id);

    if (userExists.length > 0) {
      const removeUser = await User.removeUser(id);
  
      if (removeUser) {
        res.status(200).json({
          message: 'User deleted'
        });
      }
    } else {
      res.status(404).json({
        message: 'User not found'
      })
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;
