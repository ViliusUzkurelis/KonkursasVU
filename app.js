var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var weatherRoutes = require('./routes/weatherRoutes');

var indexRouter = require('./routes/weatherRoutes');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/weather', weatherRoutes);

//Serveris isijungia naudojant 3000 Port

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Weather server is running on port ${PORT}`);
});
module.exports = app;
