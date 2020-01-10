const express = require('express');
const lenderCollectionModel = require('./lenderCollection-model.js');
const transactionModel = require('../transaction/transaction-model.js');

const router = express.Router();

// READ
router.get('/:lender_id',async (req, res) => {
    const { lender_id } = req.params;
  
    try {
      const lenderCollectionData = await lenderCollectionModel.findBooksByLenderId(lender_id);
      res.status(200).json(lenderCollectionData );
    } catch (err) {
      res.status(500).json({ message: `Failed to get book collection for the lender ${lender_id}:` + err });
    }
  });

// GET all books with same google id
router.get('/book/:book_id', async (req, res) => {
  const {book_id} = req.params;
  
  try {
    const bookList = await lenderCollectionModel.findAllSameBooks(book_id);
    
    res.status(200).json(bookList);
  } catch (err) {
    res.status(500).json({
      message: `Failed to retrieve the total amount of this book, ${book_id}`
    });
  }
})

// CREATE
router.post('/', async (req, res) => {
  const lenderBookData = req.body;

  try {
    // gets all single lender's books
    const bookList = await lenderCollectionModel.findBooksByLenderId(req.body.lender_id);

    // sorts out req google book ID
    const bookIDs = [];
    bookList.forEach(book => {
      bookIDs.push(book.google_book_id);
    });

    // find matching book
    const findBook = () => {
      return bookIDs.find(el => {
        return el === lenderBookData.google_book_id
      })
    }

    if (findBook()) {
      // if book is already added
      res.status(400).json({
        message: 'Duplicate book, please try again'
      })
    } else {
      const lenderCollectionData = await lenderCollectionModel.addBook(lenderBookData);

      res.status(201).json(lenderCollectionData);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book to collection:' + err });
  }
});

// UPDATE Availibilty flag
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [bookFound] = await lenderCollectionModel.findBookById(id);
    console.log('bookFound', bookFound)

    //checks if book has transaction open for user
    // const getTrans = await transactionModel.findTransaction(bookFound.id, bookFound.google_book_id);

    if (bookFound) {
      const lenderCollectionData = await lenderCollectionModel.toggleAvailability(bookFound);
      res.status(200).json(lenderCollectionData);
    }
    // else if (getTrans.length > 0) {
    //   res.status(204).json({ message: 'Transcation found for book' });
    // } 
    else {
      console.log('fail conditional line 85');
      res.status(404).json({ message: `Could not find book for lender collection id ${id}` });
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to update book for lender collection id ${id}:` + err });
  }
});

// DELETE a book
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [bookFound] = await lenderCollectionModel.findBookById(id);

    if (bookFound) {
      const lenderCollectionData = await lenderCollectionModel.removeBook(bookFound);
      res.status(200).json(lenderCollectionData);
    } else {
      res.status(404).json({ message: `Could not find book for lender collection id ${id}` });
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to delete book for lender collection id ${id}:` + err });
  }
});

module.exports = router;