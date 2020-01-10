const express = require('express');
const transactionModel = require('./transaction-model.js');
const lenderCollectionModel = require('../lender/lenderCollection-model.js');
const borrowerWishlistModel = require('../borrower/borrowerWishlist-model.js');
const router = express.Router();

// get transaction by user ID and book ID, return only active
router.get('/:user&:book', async (req, res) => {
  const { user, book } = req.params;

  try {
    // check for transaction matching user ID and book ID
    const transaction = await transactionModel.findTransaction(user, book);
 
    res.status(200).send({message: transaction});
  } catch(err) {
    console.log(err);
  }
})

//lend/borrow transaction
router.post('/', async (req, res) => {
    const transactionData = req.body;

    try {
        const newTransaction = await transactionModel.addTransaction(transactionData);

        console.log('newTransction 27', newTransaction);

        // let [bookFound] = await lenderCollectionModel.findBookByLenderIdAndGoogleBookId(transactionData.lender_id, transactionData.google_book_id, true);

        // if (bookFound) {
        //   await lenderCollectionModel.toggleAvailability(bookFound);
        // } else {
        //   res.status(404).json({ message: `Could not find available book for lender id ${transactionData.lender_id}` });
        // } 
    
        // [bookFound] = await borrowerWishlistModel.findBookByBorrowerIdAndGoogleBookId(transactionData.borrower_id, transactionData.google_book_id, true);

        // if (bookFound) {
        //   await borrowerWishlistModel.toggleRequestToBorrow(bookFound);
        // } else {
        //   res.status(404).json({ message: `Could not find book for borrower id ${transactionData.borrower_id}` });
        // }
    
        res.status(201).json({ message: newTransaction });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add a new transaction:' + err });
    }
});

//book return
router.put('/:id', async(req,res)=> {
    const { id } = req.params;
    try {
        const [transactionData] = await transactionModel.updateReturnTime(id);
        
        // find book by this google book id and lender id which was previously lent, and make that lender collection item available to lend again (upon return)
        let [bookFound] = await lenderCollectionModel.findBookByLenderIdAndGoogleBookId(transactionData.lender_id, transactionData.google_book_id, false);

        if (bookFound) {
          await lenderCollectionModel.toggleAvailability(bookFound);
        } else {
          res.status(404).json({ message: `Could not find available book for lender id ${transactionData.lender_id}` });
        }
    
        // find book by this google book id and borrower id which was previously borrowed, and make that borrower wishlist item requestable again (upon return)
        [bookFound] = await borrowerWishlistModel.findBookByBorrowerIdAndGoogleBookId(transactionData.borrower_id, transactionData.google_book_id, false);

        if (bookFound) {
          await borrowerWishlistModel.toggleRequestToBorrow(bookFound);
        } else {
          res.status(404).json({ message: `Could not find book for borrower id ${transactionData.borrower_id}` });
        }
        res.status(200).json(transactionData);
    } catch (err) {
        res.status(500).json({ message: `Failed to update book return time for transaction id ${id}:` + err });
    }
});
      
module.exports = router;
