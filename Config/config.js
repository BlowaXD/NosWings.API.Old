'use strict';
const sql = require('mssql');

const db_default = {
    user: 'noswings_site',
    password: 'LXV35i4Y4pn5sN7F6hbw',
    server: '164.132.206.181',
    database: 'opennos'
};

module.exports = {
    db_default,
    domain: 'NosWings',
    servers: [
        'NosWings'
    ],
    'NosWings': {
        ip: '164.132.206.181',
        port: 4002,
        multiclient: true,
        tokenSecret: 'd3hutpZ0iBpCGjxMvReEZPre4WmGIYe8LiHQAK6T',
        db: new sql.ConnectionPool(db_default, err => console.log(`DB Connection error : ${err}`)),
        email_config: {
            host: 'noswings.fr',
            port: 587,
            secure: false, // secure:true for port 465, secure:false for port 587
            auth: {
                user: 'noreply@noswings.fr',
                pass: 'cZhz57@8DOpqnzwn'
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    }
};
