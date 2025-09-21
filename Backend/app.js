// Required modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const connectDB = require("./DBConnection.js")


// Route imports
dotenv.config()
const URI = process.env.MONGO_URI;
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRoute = require('./routes/productRoute'); // ✅ Make sure this file exports router
const cartRoutes = require("./routes/CartRoute")
const SellerRoute = require("./routes/SellerRoute")

const app = express();



// MongoDB Connection
connectDB();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Middlewares
app.use(logger('dev'));
const corsOptions = {
  origin: "https://trend-bazaar-kappa.vercel.app/", // apna frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRoute); 
app.use("/cart", cartRoutes);
app.use('/seller' , SellerRoute)





// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Export app

module.exports = app;
