'use strict';
const querystring = require('querystring');
const sql = require('mssql');
const request = require('request');

const INSERT_LOG = `
    INSERT INTO _GF_CS_BuyLogs (AccountId, Type, [Value])
    VALUES (
        (SELECT AccountId FROM Account WHERE Name = @username AND [Password] = @password),
        1,
        @price
    )`;
const UPDATE_MONEY = `
    UPDATE b
        SET b.Money = b.Money - @price
    FROM _GF_CS_Accounts AS b
    JOIN Account AS a
        ON a.[AccountId] = b.[AccountId]
    WHERE a.[Name] = @username
        AND [Password] = @password`;
const GET_MONEY = `
    SELECT TOP 1 [Money]
    FROM [dbo].[Account]
    LEFT JOIN _GF_CS_Accounts
        ON [_GF_CS_Accounts].[AccountId] = [Account].[AccountId]
    WHERE [Name] = @username
        AND [Password] = @password`;
const GET_CHARACTER = `
    SELECT TOP 1 CharacterId
    FROM Account AS a
    JOIN [Character] AS c
        ON a.AccountId = c.AccountId
    WHERE a.[Name] = @username
        AND a.[Password] = @password
        AND c.State = 1
        AND c.Name = @character`;

async function get(req, res) {
    const server = global.config.servers[req.user.server || "NosWings"];
    const username = req.user.username;
    const hashedPassword = req.user.hashedPassword;
    const character = req.body.character;

    /* Some checks */
    if (!server)
        return res.status(403).send({success: false, error: global.translate.WRONG_SERVER});
    if (!username || !hashedPassword || !packId || !character)
        return res.status(400).send({success: false, error: global.translate.BAD_QUERY});

    /* Get account */
    let money;
    let character_id;
    try {
        /* Check character name */
        let request = await server.db.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .input('character', sql.VarChar, character)
            .query(GET_CHARACTER);
        character_id = request.recordset[0].CharacterId;
        if (!character_id)
            throw new Error(`Unable to find character ${character}`);

        /* Get money */
        request = await server.db.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, hashedPassword)
            .query(GET_MONEY);
        money = parseInt(request.recordset[0].Money);
        if (!Number.isInteger(money))
            throw new Error(`Unable to find ${username}'s' money`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    let Price;
    let Authority;
    switch (Pack) {
        case "VIP":
            Authority = 1;
            Price = 2500;
            break;
        case "VIP+":
            Authority = 3;
            Price = 5000;
            break;
        case "VIP++":
            Authority = 5;
            Price = 7500;
            break;
        case "DONATOR":
            Authority = 10;
            Price = 10000;
            break;
        case "DONATOR+":
            Authority = 15;
            Price = 12500;
            break;
        case "DONATOR++":
            Authority = 20;
            Price = 17500;
            break;
        default:
            return res.status(403).send({success: false, error: global.translate.NOT_ENOUGH_MONEY});
            return;
    }

    if (money < Price) {
        return res.status(403).send({success: false, error: global.translate.NOT_ENOUGH_MONEY});
    }

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
            // FUCK IT
            return;
        }

        const setNewRole = {
            method: 'POST',
            url: server.ingame_api_url + '/authority',
            headers: {
                'Authorization': `bearer ${body.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CharacterId: character_id,
                WorldGroup: req.user.server,
                Authority: Authority,
            })
        };
        // SEND ITEM
        await request(setNewRole, async (erro, responses, bodi) => {
            if (erro) {
                console.log(erro);
                return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
            }

            /* Remove golds */
            try {
                await server.db.request()
                    .input('price', sql.Int, Price)
                    .input('username', sql.VarChar, username)
                    .input('password', sql.VarChar, hashedPassword)
                    .query(UPDATE_MONEY);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
            }

            /* Log */
            try {
                await server.db.request()
                    .input('price', sql.Int, Price)
                    .input('username', sql.VarChar, username)
                    .input('password', sql.VarChar, hashedPassword)
                    .query(INSERT_LOG);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
            }

            /* Send items */

            res.sendStatus(200);
        });

    });
}

module.exports = get;
