const db=require('../database/dbConfig.js');
 
 module.exports={
    findBooksByLenderId,
    findBookById,
    findAllSameBooks,
    addBook,
    toggleAvailability,
    removeBook,
    findBookByLenderIdAndGoogleBookId
}

// Find books by lender Id.
async function findBooksByLenderId(lenderId){
    return db('lender_collection').where({lender_id: lenderId});
}

// Find book by lender collection Id (primary key)
async function findBookById(id){
    return db('lender_collection').where({id});
}

async function findAllSameBooks(id) {
    return db('lender_collection').where({google_book_id: id});
}

// Create a book in lender collection
async function addBook(lenderCollectionItem){
    await db('lender_collection').insert(lenderCollectionItem);
    return findBooksByLenderId(lenderCollectionItem.lender_id);
}

// Toggle the availability flag
async function toggleAvailability(lenderCollectionItem){
    const changes = lenderCollectionItem;
    changes.is_available = !changes.is_available;
    await db('lender_collection').where({ id: changes.id }).update(changes);
    return findBooksByLenderId(changes.lender_id);
}

// Remove a book from the lender collection
async function removeBook(lenderCollectionItem){
    await db('lender_collection').where({ id: lenderCollectionItem.id }).del();
    return findBooksByLenderId(lenderCollectionItem.lender_id);
}

// Find book by lender Id and google book id
async function findBookByLenderIdAndGoogleBookId(lenderId, googleBookId, isAvailable){
    return db('lender_collection').where({lender_id: lenderId, google_book_id: googleBookId, is_available: isAvailable});
}

