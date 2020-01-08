const db = require("../database/dbConfig.js");

module.exports = {
  findTransactionById,
  addTransaction,
  updateReturnTime
};

// Find transaction for a given id
async function findTransactionById(id) {
  return await db("transactions").where({ id });
}

// Add a transaction history
async function addTransaction(transaction) {
  const [id] = await db("transactions")
    .returning("id")
    .insert(transaction);
  return findTransactionById(id);
}

// Update time stamp of return time
async function updateReturnTime(id) {
  await db("transactions")
    .where({ id })
    .update({ return_time: db.fn.now() });
  return findTransactionById(id);
}
