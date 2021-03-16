const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./sqlite3_test.db"
    }
  });

  

module.exports = knex;