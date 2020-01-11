const db = require("../database/dbConfig.js");

module.exports = {
  findTransaction,
  findTransactionById,
  addTransaction,
  updateReturnTime
};

// Find transaction for a given id
async function findTransaction(user_id, google_book_id) {

  // get books where lender id and google book id are found
  const lendTransactions = await db("transactions").where({ lender_id: user_id, google_book_id });
  console.log('lendTrans', lendTransactions);

  if (lendTransactions.length === 0) {
    // if lender transaction does not match, check with borrower id
    const borrTransactions = await db("transactions").where({ borrower_id: user_id, google_book_id});
    console.log('borrTransactions', borrTransactions);

    return filterReturn(borrTransactions);
  } else {
    // if lender transaction does match
    return filterReturn(lendTransactions);
  }

  function filterReturn(transactions) {
    if (transactions.length > 0) {
      // return all available books, not returned yet
      return transactions.filter(trans => trans.return_time === null)[0];
    } else {
      return [];
    }
  }
}

async function findTransactionById(id) {
  return await db("transactions").where({ id });
}

// Add a transaction history
async function addTransaction(transaction) {

  // get all matching transcations of lender, borrower, and google book
  const findDupTrans = await db("transactions").where({
    lender_id: transaction.lender_id,
    borrower_id: transaction.borrower_id,
    google_book_id: transaction.google_book_id
  });

  async function insertTranscation() {
    // insert transaction
    const id = await db("transactions").insert(transaction).returning('id');
    // get new transcation info
    const newTransaction = await db("transactions").where([id]);

    return newTransaction;
  }

  if (findDupTrans.length > 0) {
    //loop through for active transactions for non-returned books
    const openTrans = findDupTrans.filter(trans => trans.return_time === null);
    
    if (openTrans.length > 0) {
      return openTrans;
    } else {
      insertTranscation();
    }
  } else {
    insertTranscation();
  }
}

// Update time stamp of return time
async function updateReturnTime(id) {
  await db("transactions")
    .where({ id })
    .update({ return_time: db.fn.now() });
  return findTransactionById(id);
}
