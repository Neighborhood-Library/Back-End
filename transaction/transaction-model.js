const db = require("../database/dbConfig.js");

module.exports = {
  findTransactionById,
  addTransaction,
  updateReturnTime
};

// Find transaction for a given id
async function findTransactionById(id) {
  const transactions = await db("transactions").where({ id });

  if (transactions.length > 1) {
    transactions.reduce(tran => tran.return_time !== null);
  } else {
    return transactions;
  }
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
