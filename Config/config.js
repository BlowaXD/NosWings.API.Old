'use strict';
module.exports = {
    domain: 'NosWings',
    servers: [
        'NosWings'
    ],
    'NosWings': {
        ip: '164.132.206.181',
        port: 4002,
        multiclient: true,
        tokenSecret: 'giuheriuhteruihtehurihtiuehiujthiu',
        database: {
            user: 'sa',
            password: 'root',
            server: 'localhost',
            database: 'opennos'
        },
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
