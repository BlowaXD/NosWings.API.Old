'use strict';
const querystring = require('querystring');
const request = require('request');

async function get(req, res) {
    const server = global.config.servers["NosWings"];
    // AUTH ON WEBAPI
    const form = {
        grant_type: 'password',
        username: 'NosWingsNosmall',
        password: 'DStrejuiyFGDrteGH',
    };
    const formData = querystring.stringify(form);
    const contentLength = formData.length;
    const opt = {
        method: 'post',
        url: server.ingame_api_url + '/token',
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    };

    // GET TOKEN
    request(opt, async (err, response, body) => {
        if (err) {
            res.sendStatus(500);
        }
        console.log(body);

        const getStatusOpt = {
            method: 'GET',
            url: server.ingame_api_url + '/stat',
            headers: {
                'Authorization': `bearer ${body.access_token}`,
                'Content-Type': 'application/json'
            }
        };
        // SEND ITEM
        await request(getStatusOpt, async (erro, responses, bodi) => {
            if (erro) {
                console.log(erro);
                return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
            }
            res.status(200).send(bodi);
        });
    });
}

module.exports = get;
