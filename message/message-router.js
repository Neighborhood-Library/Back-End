const express = require("express");
const messageModel = require("./message-model.js");
const transactionModel = require('../transaction/transaction-model.js');
const lenderCollectionModel = require('../lender/lenderCollection-model.js');
const borrowerWishlistModel = require('../borrower/borrowerWishlist-model.js');
const router = express.Router();

// READ
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [messageData] = await messageModel.findMessageById(id);
    res.status(200).json(messageData);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Failed to get message for the id ${id}:` + err });
  }
});

// READ BY book id
// router.get("/:google_book_id", async (req, res) => {
//   const { google_book_id } = req.params;

//   try {
//     const messageData = await messageModel.findMessagesByBookId(google_book_id);
//     res.status(200).json(messageData);
//   } catch (err) {
//     res.status(500).json({
//       message: `Failed to get message for the book id ${google_book_id}:` + err
//     });
//   }
// });

// GET all messages by transaction ID
router.get("/tran/:transaction_id", async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const messages = await messageModel.findMessagesByTranId(transaction_id);
    
    if (messages.length > 0) {
      res.status(200).json(messages);
    } else {
      res.status(204).json({});
    }
  } catch (err) {
    res.status(500).json({
      message: `Error finding Transaction: ${google_book_id}<br>` + err
    });
  }
});

// CREATE
router.post("/", async (req, res) => {
  const messageData = req.body;

  try {
    // STEP 1: ADD MESSAGE
    const [addedMessage] = await messageModel.addMessage(messageData);

    // if message sent is of type BORROW_RESPONSE_OK, then lender has accepted borrower's request
    // (book is lent) and we can create a transaction
    if ("BORROW_RESPONSE_OK" === addedMessage.message_type) {
      const transactionData = {
        borrower_id: addedMessage.receiver_id,
        lender_id: addedMessage.sender_id,
        message_id: addedMessage.id,
        google_book_id: addedMessage.google_book_id,
        borrow_time: addedMessage.message_time
      };

      try {
        // STEP 2: ADD TRANSACTION
        const newTransaction = await transactionModel.addTransaction(transactionData);

        // STEP 3: MAKE BOOK UNAVAILABLE IN LENDER COLLECTION
        let [bookFound] = await lenderCollectionModel.findBookByLenderIdAndGoogleBookId(
          transactionData.lender_id,
          transactionData.google_book_id,
          true
        );

        if (bookFound) {
          await lenderCollectionModel.toggleAvailability(bookFound);
        } else {
          res
            .status(404)
            .json({
              message: `Could not find available book for lender id ${transactionData.lender_id}`
            });
        }

        // STEP 4: UPDATE BORROWER WISHLIST - BORROWER IS NOT LOOKING TO BORROW THIS BOOK ANYMORE
        [bookFound] = await borrowerWishlistModel.findBookByBorrowerIdAndGoogleBookId(
          transactionData.borrower_id,
          transactionData.google_book_id,
          true
        );

        if (bookFound) {
          await borrowerWishlistModel.toggleRequestToBorrow(bookFound);
        } else {
          res
            .status(404)
            .json({message: `Could not find book for borrower id ${transactionData.borrower_id}`});
        }

        res.status(201).json(newTransaction);
      } catch (err) {
        res
          .status(500)
          .json({ message: "Failed to add a new transaction:" + err });
      }
    } else {
      res.status(201).json(addedMessage);
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to create new message:" + err });
  }
});

module.exports = router;
