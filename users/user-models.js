const db = require('../database/dbConfig.js');

module.exports = {
  getUserById,
  addUser,
  updateUser,
  removeUser
}

// Finds user by user ID
function getUserById(id) {
  return db('users').where({id});
}

// Creates user
function addUser(user) {
  console.log(user);

  return db('users').insert(user);
}

// Updates user info by user ID
function updateUser(info, id) {
  return db('users')
    .where({id})
    .update(info);
}

// Delete user
function removeUser(id) {
  return db('users').where({id}).del();
} 