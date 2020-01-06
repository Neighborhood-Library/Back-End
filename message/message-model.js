const db=require('../database/dbConfig.js');
 
 module.exports={
    findMessageById,
    findMessagesByBookId,
    findMessagesByTranId,
    addMessage
}

// Find message by message Id (primary key)
async function findMessageById(id){
    return db('messages').where({ id });
}

// Find messages by google book id
async function findMessagesByBookId(google_book_id){
    return db('messages').where({google_book_id: google_book_id});
}

// Find messages by transaction id
async function findMessagesByTranId(transaction_id){
    return db('messages').where({transaction_id});
}

// Create a message
async function addMessage(message){
    const [id] = await db('messages').insert(message).returning('id');
    return findMessageById(id);
}


