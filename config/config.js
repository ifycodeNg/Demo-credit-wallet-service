exports.config = {
  username: process.env.MYSQL_USERNAME,
  publicKey: process.env.FLW_PUBLIC_KEY,
  secretKey: process.env.FLW_SECRET_KEY,
  secret: process.env.secret,
  redisSecret: process.env.redisSecret,
  EncryptionKey: process.env.ENCRYPTION_KEY,
  BASE_API_URL: process.env.BASE_API_URL,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  },
};
