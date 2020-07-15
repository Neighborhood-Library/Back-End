# API Documentation

## Getting started

To get the server running locally:

- Clone this repo
- **yarn install** to install all required dependencies
- **yarn server** to start the local server

### Node, Express, and PostgreSQL

-    Node and Express are core foundations to start from
-    Easy package management
-    PostgreSQL allowed for data persistence and relational data

## Endpoints

#### Auth Routes
API prefix: `/auth`

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/logout`               | Returns user info.                                 |
| GET    | `/current_user`         | Returns user info based on cookie data.            |
| POST   | `/login`                | Checks user creds and assigns cookie.              |
| POST   | `/register`             | Registers user.                                    |

#### Message Routes
API prefix: `/api/users`

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/:id`                  | Returns user info.                                 |
| GET    | `/tran/:transaction_id` | Updates info for a single user.                    |
| POST   | `/`                     | Creates message.                                   |

#### User Routes (protected)
API prefix: `/api/users`

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/:id`                  | Returns user info.                                 |
| PUT    | `/:id`                  | Updates info for a single user.                    |
| DELETE | `/:id`                  | Delete user.                                       |

#### Lender Routes (protected)
API prefix: `/api/lender-collection`

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/:lender_id`           | Returns books added by lender.                     |
| GET    | `/book/:book_id`        | Returns books with same google ID                  |
| POST   | `/`                     | Adds book record for lender.                       |
| PUT    | `/:id`                  | Updates if book is available.                      |
| DELETE | `/:id`                  | Deletes book record for lender.                    |

#### Borrower Routes (protected)
API prefix: `/api/borrower-wishlist`

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/:borrower_id`         | Returns wishlisted books added by borrow.          |
| POST   | `/`                     | Adds book record to borrower wishlist.             |
| PUT    | `/:id`                  | Updates book request status for borrow record.     |
| DELETE | `/:id`                  | Deletes wishlisted book for borrower.              |

#### Transaction Routes (protected)
API prefix: `/api/transaction`

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/:user&:book`          | Return active transaction by user ID and book ID.  |
| POST   | `/`                     | Adds transaction.                                  |
| PUT    | `/:id`                  | Updates transaction with return date.              |


# Data Model

#### USERS

---

```
{
  id: UUID,
  first_name: STRING
  last_name: STRING
  user_name: STRING
  user_email: STRING
  user_identity: STRING (classification of login)
  user_credential: STRING
}
```

#### LENDER COLLECTION

---

```
{
  id: UUID
  lender_id: INTEGER (references id in USERS table)
  google_book_id: STRING
  isbn: INTEGER
  is_available: BOOLEAN
}
```

#### ORGANIZATIONS

---

```
{
  id: UUID
  name: STRING
  industry: STRING
  paid: BOOLEAN
  customer_id: STRING
  subscription_id: STRING
}
```

#### USERS

---

```
{
  id: UUID
<<<<<<< HEAD
  borrower_id: INTEGER (references id in USERS table)
  lender_id: INTEGER (references id in USERS table)
  google_book_id: STRING
  borrow_time: TIMESTAMP (auto assigned)
  return_time: TIMESTAMP (auto assigned)
}
```

#### MESSAGES

---

```
{
  id: UUID
  transaction_id: INTEGER (references id in TRANSACTIONS table)
  sender_id: INTEGER (references id in USERS table)
  first_name: STRING
  content: STRING
  message_time: TIMESTAMP (auto assigned)
}
```

=======
  organization_id: UUID foreign key in ORGANIZATIONS table
  first_name: STRING
  last_name: STRING
  role: STRING [ 'owner', 'supervisor', 'employee' ]
  email: STRING
  phone: STRING
  cal_visit: BOOLEAN
  emp_visit: BOOLEAN
  emailpref: BOOLEAN
  phonepref: BOOLEAN
}
```

## 2️⃣ Actions
>>>>>>> 110945f72d1b6d96721a85b821dd69a2ea73540c

🚫 This is an example, replace this with the actions that pertain to your backend

`getOrgs()` -> Returns all organizations

<<<<<<< HEAD
- `getUserById(id)` -> Returns user info by user ID
- `addUser(info)` -> Creates user
- `updateUser(info, id)` -> Updates user by user ID
- `removeUser(id)` -> Deletes user by user ID
=======
`getOrg(orgId)` -> Returns a single organization by ID
>>>>>>> 110945f72d1b6d96721a85b821dd69a2ea73540c

`addOrg(org)` -> Returns the created org

<<<<<<< HEAD
- `findBooksByLenderId(lender_id)` -> Returns all books by lender ID
- `findBookById(id)` -> Returns lendable book by ID
- `findAllSameBooks(id)` -> Returns lendable books by google ID
- `addBook(lenderBook)` -> Creates lendable book
- `toggleAvailability(lenderBook)` -> Updates book available status by google_book_id
- `removeBook(lenderBook)` -> Deletes lendable book by lender ID
- `findBookByLenderIdAndGoogleBookId(lenderID, googleBookId, isAvailable` -> Find book by lender ID and google book id
=======
`updateOrg(orgId)` -> Update an organization by ID
>>>>>>> 110945f72d1b6d96721a85b821dd69a2ea73540c

`deleteOrg(orgId)` -> Delete an organization by ID
<br>
<br>
<br>
`getUsers(orgId)` -> if no param all users

<<<<<<< HEAD
- `findBooksByBorrowerId(borrower_id)` -> Returns books by borrower ID
- `findBookById(id)` -> Returns book by borrower ID
- `addBook(borrowWishlist)` -> Creates borrow request for book
- `toggleRequestToBorrow(borrowWishlist)` -> Toggles borrow request flag in UI
- `removeBook(borrowWishlist)` -> Deletes book request
- `findBookByBorrowerIdAndGoogleBookId(borrowerId, googleBookId, requestToBorrow)` -> Find book by borrower Id and google book id
=======
`getUser(userId)` -> Returns a single user by user ID
>>>>>>> 110945f72d1b6d96721a85b821dd69a2ea73540c

`addUser(user object)` --> Creates a new user and returns that user. Also creates 7 availabilities defaulted to hours of operation for their organization.

<<<<<<< HEAD
- `findTransaction(user_id, google_book_id)` -> Returns transaction by user ID and google ID
- `findTransactionById(id)` -> Returns transaction info
- `addTransaction(info)` -> Creates transaction
- `updateReturnTime(id)` -> Updates transaction with returned book date

#### MESSAGES

- `findMessageById(id)` -> Returns message by message ID
- `findMessagesByBookId(google_book_id)` -> Find messages by google book id
- `findMessagesByTranId(transaction_id)` -> Find messages by transaction id
- `addMessage(message)` -> addMessage(message)
=======
`updateUser(userId, changes object)` -> Updates a single user by ID.

`deleteUser(userId)` -> deletes everything dependent on the user
>>>>>>> 110945f72d1b6d96721a85b821dd69a2ea73540c

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

- PGHOST = postgreSQL host
- PGDB = postgreSQL database name
- PGUSER = postgreSQL super user name
- PGPASS = postgreSQL super user password
- googleClientID = Google API ID (Google+ API)
- googleClientSecret = Google API secret
- DB_ENV = set to "development", plans to impliment "production"

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

 **If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**
 - Check first to see if your issue has already been reported.
 - Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
 - Create a live example of the problem.
 - Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes,  where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).
