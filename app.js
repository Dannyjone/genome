const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config')
const fs = require('fs');
const models = path.join(__dirname, 'mongodb/models');
const app = express();

/************************************************************************************* */
/************************************************************************************* */
/************************************************************************************* */
//连接mongod数据库
mongoose.connect(`mongodb://localhost:${config.MongoDB_Port}/${config.MongoDB_Path}`, {
  useMongoClient: true,
});
//注册mongoose模型
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(path.join(models, file)));
/************************************************************************************* */
/************************************************************************************* */
/************************************************************************************* */
const admin = require('./routes/admin');
const apidoc = require('./routes/apidoc');
const api = require('./routes/api');
const business = require('./routes/business');
const geneapi = require('./routes/geneapi');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

morgan.format('Log', '[Gene] :method :url :status');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'));
app.use(morgan('Log', { stream: accessLogStream }));
app.use(morgan('dev'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);
app.use('/apidoc', apidoc);
app.use('/admin', admin);
app.use('/api', api);
app.use('/api', business);
app.use('/api', geneapi);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
