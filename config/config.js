exports.config = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  host: process.env.MYSQL_HOST,
  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  },
};
