const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const redis = require('ioredis');
const connectRedis = require('connect-redis');
const Route = require('./routes/index');
const { config } = require('./config/config');

const app = express();
const RedisStore = connectRedis(session);

// Configure redis client
const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,

});

redisClient.on('error', (err) => {
  console.log(`Could not establish a connection with redis. ${err}`);
});
redisClient.on('connect', (err) => {
  console.log('Connected to redis successfully');
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: config.redisSecret,
  resave: false,
  cookie: {
    maxAge: 60000,
  },
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v0', Route);

module.exports = app;
