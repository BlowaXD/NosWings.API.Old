'use strict';
const sql = require('mssql');

const db_default = {
    user: 'noswings_website',
    password: '5q78c5d8QAHmeAKak6k6GqV3Z2',
    server: '51.15.162.157',
    database: 'opennos'
};

module.exports = {
    default_server: 'NosWings',
    e_permissions: {
        IS_ADMIN: 0b00000001,
        IS_GM: 0b00000010,
    },
    servers: {
        'NosWings': {
            public: true,
            tokenSecret: 'secret',
            ingame_api_url: 'http://' + db_default.server + ':9000',
            db: new sql.ConnectionPool(db_default, err => console.log(`DB Connection error : ${err}`))
        }
    }
};