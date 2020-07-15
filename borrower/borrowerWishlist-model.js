const db=require('../database/dbConfig.js');

 module.exports={
    findBooksByBorrowerId,
    findBookById,
    addBook,
    toggleRequestToBorrow,
    removeBook,
    findBookByBorrowerIdAndGoogleBookId
}

// Find books by borrower id.
async function findBooksByBorrowerId(borrowerId){
    return db('borrower_wishlist').where({borrower_id: borrowerId});
}

// Find book by borrower Id (primary key)
async function findBookById(id){
    return db('borrower_wishlist').where({ id });
}

// Create a book in borrower wishlist
async function addBook(borrowerWishlistItem){
    await db('borrower_wishlist').insert(borrowerWishlistItem);
    return findBooksByBorrowerId(borrowerWishlistItem.borrower_id);
}

// Toggle the 'Request to Borrow' flag
async function toggleRequestToBorrow(borrowerWishlistItem){
    const changes = borrowerWishlistItem;
    changes.request_to_borrow = !changes.request_to_borrow;
    await db('borrower_wishlist').where({ id: changes.id }).update(changes);
    return findBooksByBorrowerId(changes.borrower_id);
}

// Remove a book from the borrower wishlist
async function removeBook(borrowerWishlistItem){
    await db('borrower_wishlist ').where({id: borrowerWishlistItem.id}).del();
    return findBooksByBorrowerId(borrowerWishlistItem.borrower_id);
}

// Find book by borrower Id and google book id
async function findBookByBorrowerIdAndGoogleBookId(borrowerId, googleBookId, requestToBorrow){
    return db('borrower_wishlist').where({borrower_id: borrowerId, google_book_id: googleBookId, request_to_borrow: requestToBorrow});
}