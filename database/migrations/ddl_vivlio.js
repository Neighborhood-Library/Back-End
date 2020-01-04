exports.up = function(knex) {
    return knex
        .schema
        .createTable('users', users => {
            users.increments(); //Id
            //first name, last name, email, username, password Are what the registration form has so
            //we need to add line 9 and 10:
            users.string('first_name', 255).notNullable();
            users.string('last_name', 255).notNullable();
            users.string('user_name', 255).notNullable().unique();//username
            users.string('user_email', 255).notNullable().unique();//email
            users.string('user_identity', 255).notNullable();//'muoVivlio' || 'google'
            users.string('user_credential', 255).notNullable();//'password' || "googleProfile.id" 
        })
        .createTable('lender_collection',tbl =>{
            tbl.increments();
            tbl.string('google_book_id',255).notNullable();
            tbl.integer('lender_id')
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .notNullable();
            tbl.string('isbn',128).notNullable();
            tbl.boolean('is_available').defaultTo(false).notNullable();
        })
        .createTable('borrower_wishlist',tbl =>{
            tbl.increments();
            tbl.string('google_book_id',255).notNullable();
            tbl.integer('borrower_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .notNullable();
            tbl.string('isbn',128).notNullable();
            tbl.boolean('request_to_borrow').defaultTo(false).notNullable();
        })
    .createTable('transactions',tbl =>{
            tbl.increments();        
            tbl.integer('borrower_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .notNullable();
            tbl.integer('lender_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .notNullable();
            tbl.string('google_book_id',255).notNullable();
            tbl.string('isbn',128).notNullable();
            tbl.timestamp('borrow_time').defaultTo(knex.fn.now()).notNullable();
            tbl.timestamp('return_time'); //nullable - will be updated when lender makes book available again
        });
};

exports.down = function(knex) {
    return knex
    .schema
    .dropTableIfExists('transactions')
    .dropTableIfExists('borrower_wishlist') 
    .dropTableIfExists('lender_collection')
    .dropTableIfExists('users');
};
