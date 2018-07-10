require('dotenv').config();
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const errorHandler = require('errorhandler');
const http = require('http');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const log = require('./util/logger');

const app = express();

app.set('port', process.env.PORT || 3005);
app.set('docRoot', path.resolve(__dirname, '../public'));

app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());
app.use(serveStatic(app.get('docRoot')));
app.use(cors());

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

require('./datalayer/db')(app);
require('./routes')(app);

http.createServer(app).listen(app.get('port'), () => {
  log.info(`Express server listening on port ${app.get('port')}`);
});
