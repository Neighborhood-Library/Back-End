const express = require('express');
const server = express();
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const passport = require('passport');
const flash = require('connect-flash');

const lenderRouter = require('./lender/lenderCollection-router.js');
const borrowerRouter = require('./borrower/borrowerWishlist-router.js');
const authRouter = require('./services/auth-routes.js');
const usersRouter = require('./users/user-routes.js');
const transactionRouter = require('./transaction/transaction-router.js');
const messageRouter = require('./message/message-router.js')
const chatRouter = require('./chat/chat-router.js');

const messageModel = require('./message/message-model.js');

//middleware to all routers to ensure they are protected. DO NOT USE ON AUTHROUTER.  Was added to borrowerRouter, and lenderRouter.
function protectedRoute(req, res, next) {
  if (req.isAuthenticated()) {
    return next(null);
  } else {
    res.redirect('/login'); 
  }
}

server.use(helmet());
server.use(cors({ origin: process.env.REQ_URL, credentials: true }));
server.use(express.json());
server.use(flash());
server.use(
  cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [process.env.cookieKey],
      // secure: true,
      sameSite: 'lax'
  })
);
server.use(passport.initialize());
server.use(passport.session());
server.use(function(req, res, next){
  console.log(`${req.method} from ${req.headers['referer']}`);
  next();
});

server.use('/auth', authRouter);
server.use('/api/chat', chatRouter);
server.use('/api/lender-collection', protectedRoute, lenderRouter);
server.use('/api/borrower-wishlist', protectedRoute, borrowerRouter);
server.use('/api/users', protectedRoute, usersRouter);
server.use('/api/transaction', protectedRoute, transactionRouter);
server.use('/api/message', protectedRoute, messageRouter);

const phrase = '<h1>Post requests are not allowed here</h1>';

server.post('/', (req, res) => {
  res.send(phrase);
});

server.put('/', (req, res) => {
  res.send(phrase);
});

server.delete('/', (req, res) => {
  res.send(phrase);
});

server.get('/', (req, res) => {
  res.status(200).json("Welcome to the muoVivlio, your peer-to-peer neighbor library.");
});

const app = http.createServer(server);
const io = require('socket.io')(app);

io.on('connection', (socket) => {
  // console.log(socket.id);

  socket.on('message', async (msg) => {
    console.log(msg);

    const id = await messageModel.addMessage(msg);

    console.log(id);

    socket.emit('retMsg', {
      text: msg,
      name: 'Rick'
    });

    socket.broadcast.emit('update');
  });

});

  
module.exports = app;