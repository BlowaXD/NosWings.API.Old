'use strict';
const sql = require('mssql');

const db_default = {
    user: 'noswings_site',
    password: 'LXV35i4Y4pn5sN7F6hbw',
    server: '164.132.206.181',
    database: 'opennos'
};

module.exports = {
    default_server: 'NosWings',
    e_permissions: {
        IS_ADMIN: 0b00000001,
        IS_GM: 0b00000010,
    },
    servers: {
        'Official': {
            public: false,
            tokenSecret: 'secret',
            db: new sql.ConnectionPool(db_default, err => console.log(`DB Connection error : ${err}`)),
            email_config: {
                host: '',
                port: 587,
                secure: false,
                auth: {
                    user: '',
                    pass: ''
                },
                tls: {
                    rejectUnauthorized: false
                }
            }
        },
        'NosWings': {
            public: true,
            tokenSecret: 'secret',
            ingame_api_url : 'http://play.noswings.fr:9000',
            db: new sql.ConnectionPool(db_default, err => console.log(`DB Connection error : ${err}`)),
            email_config: {
                host: 'gamefield.fr',
                port: 587,
                secure: false, // secure:true for port 465, secure:false for port 587
                auth: {
                    user: 'register@gamefield.fr',
                    pass: '29Htv65E6mSDWg7tcLu4'
                },
                tls: {
                    rejectUnauthorized: false
                }
            }
        }
    }
};
