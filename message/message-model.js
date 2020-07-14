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
    console.log(message);

    const [getUserInfo] = await db('users').where({id: message.sender_id});
    console.log('getUserInfo', getUserInfo);

    const [newMessageID] = await db('messages').insert({...message, first_name: getUserInfo.first_name}).returning('id');
    console.log('newMessageID', newMessageID)
    
    const [newMessage] = await db('messages').where({id: newMessageID});
    console.log('newMessage', newMessage);

    if (newMessage) {
        return newMessage;
    } else {
        return;
    }

    // return findMessageById(id);
}


