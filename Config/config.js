module.exports = {
    domain: 'NosWings',
    'Official': {
        ip: '79.110.84.75',
        port: 4002,
        multiclient: true,
        tokenSecret: '',
        database: {
            user: '',
            password: '',
            server: '',
            database: ''
        },
        email: '',
        email_config: {
            host: '',
            port: 1337,
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
        ip: '164.132.206.181',
        port: 4002,
        multiclient: true,
        tokenSecret: 'giuheriuhteruihtehurihtiuehiujthiu',
        database: {
            user: 'noswings_site',
            password: '',
            server: '164.132.206.181',
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
    },
    'NosFun': {
        ip: '127.0.0.1',
        port: 5050,
        multiclient: true,
        tokensecret: 'yolo',
        database: {
            user: '',
            password: '',
            server: '',
            database: 'opennos'
        },
        email: '',
        email_config: {
            host: '',
            port: 1337,
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
};
