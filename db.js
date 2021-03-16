const knex = require ('knex') ({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Primera136',
        database: 'test_knex'
    },
    pool: { min: 2, max: 8}
})

module.exports = knex;