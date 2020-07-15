const express = require('express');
const borrowerWishlistModel = require('./borrowerWishlist-model.js');

const router = express.Router();

// READ
router.get('/:borrower_id',async (req, res) => {
    const { borrower_id } = req.params;

    try {
      const borrowerWishlistData = await borrowerWishlistModel.findBooksByBorrowerId(borrower_id);
      res.status(200).json(borrowerWishlistData);
    } catch (err) {
      res.status(500).json({ message: `Failed to get book wishlist for the borrower ${borrower_id}:` + err });
    }
  });

// CREATE
router.post('/', async (req, res) => {
  const borrowerBookData = req.body;

  try {
    // gets all user books
    const bookList = await borrowerWishlistModel.findBooksByBorrowerId(req.body.borrower_id);
    // sorts out google book ID
    const bookIDs = [];
    bookList.forEach(book => {
      bookIDs.push(book.google_book_id);
    });
    
    const findBook = () => {
      return bookIDs.find(el => {
        return el === borrowerBookData.google_book_id
      })
    }

    if (findBook() !== undefined) {
      // if book is already added
      res.status(500).json({
        message: 'Duplicate book, please try again'
      });
    } else {
      const borrowerWishlistData = await borrowerWishlistModel.addBook(borrowerBookData);

      res.status(201).json(borrowerWishlistData);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book to wishlist:' + err });
  }
});

// UPDATE Request to Borrow flag
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [bookFound] = await borrowerWishlistModel.findBookById(id);

    if (bookFound) {
      const borrowerWishlistData = await borrowerWishlistModel.toggleRequestToBorrow(bookFound);
      res.status(200).json(borrowerWishlistData);
    } else {
      res.status(404).json({ message: `Could not find book for borrower wishlist id ${id}` });
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to update book for borrower wishlist id ${id}:` + err });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [bookFound] = await borrowerWishlistModel.findBookById(id);

    if (bookFound) {
      const borrowerWishlistData = await borrowerWishlistModel.removeBook(bookFound);
      res.status(200).json(borrowerWishlistData);
    } else {
      res.status(404).json({ message: `Could not find book for borrower wishlist id ${id}` });
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to delete book from borrower wishlistid ${id}:` + err });
  }
});

module.exports = router;