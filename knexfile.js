// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: process.env.MYSQL_DB,
      user:     process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      database: process.env.MYSQL_DB,
      user:     process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
