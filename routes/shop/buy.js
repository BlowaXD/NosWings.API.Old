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
const GET_PACK = `
    SELECT *
    FROM _GF_CS_Packs AS p
    JOIN _GF_CS_PackItem AS i
        ON p.PackId = i.PackId
    WHERE p.PackId = @packid`;
const GET_CHARACTER = `
    SELECT TOP 1 CharacterId
    FROM Account AS a
    JOIN [Character] AS c
        ON a.AccountId = c.AccountId
    WHERE a.[Name] = @username
        AND a.[Password] = @password
        AND c.State = 1
        AND c.Name = @character`;
const SEND_MAIL = `
    INSERT INTO [Mail] (
        [AttachmentAmount],
        [AttachmentRarity],
        [AttachmentUpgrade],
        [AttachmentVNum],
        [IsOpened],
        [IsSenderCopy],
        [ReceiverId],
        [SenderClass],
        [SenderGender],
        [SenderHairColor],
        [SenderHairStyle],
        [SenderId],
        [SenderMorphId],
        [Title])
    VALUES (
        @AttachementAmount,
        @AttachementRarity,
        @AttachmentUpgrade,
        @AttachmentVNum,
        '0',
        '0',
        @character_id,
        '0',
        '0',
        '0',
        '0',
        '13',
        '-1',
        @Title)`;

async function get(req, res) {
    const server = global.config.servers[req.user.server];
    const username = req.user.username;
    const hashedPassword = req.user.hashedPassword;
    const character = req.body.character;
    const packId = parseInt(req.body.PackId);

    /* Some checks */
    if (!server)
        return res.status(403).send({success: false, error: global.translate.WRONG_SERVER});
    if (!username || !hashedPassword || !packId || !character)
        return res.status(400).send({success: false, error: global.translate.BAD_QUERY});

    /* Get account */
    let money;
    let items;
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

        /* Get pack's items */
        request = await server.db.request()
            .input('packid', sql.Int, packId)
            .query(GET_PACK);
        items = request.recordset;
        if (!items || items.length < 1)
            throw new Error(`Unable to find items for pack with ID ${packId}`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    if (money < items[0].Price)
        return res.status(403).send({success: false, error: global.translate.NOT_ENOUGH_MONEY});

    /* Create item list */
    let item_list;
    if (items[0].Type === 1) {
        let total_items = [];
        items.forEach(function (elem) {
            for (let i = 0; i < elem.Probability; i++) {
                total_items.push(elem);
            }
        });
        const tmp = total_items[Math.floor(Math.random() * total_items.length)];
        item_list = [{
            AttachementAmount: tmp.ItemQuantity,
            AttachementRarity: tmp.ItemDesign,
            AttachmentUpgrade: tmp.ItemUpgrade,
            AttachmentVNum: tmp.ItemVnum,
            Title: req.user.server
        }];
    }
    else {
        item_list = items.map(i => new Object({
            AttachementAmount: i.ItemQuantity,
            AttachementRarity: i.ItemDesign,
            AttachmentUpgrade: i.ItemUpgrade,
            AttachmentVNum: i.ItemVnum,
            Title: req.user.server
        }));
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

        for (const i of item_list) {
            const sendmailOpt = {
                method: 'POST',
                url: server.ingame_api_url + '/mail',
                headers: {
                    'Authorization': `bearer ${body.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    CharacterId: character_id,
                    WorldGroup: req.user.server,
                    IsNosmall: true,
                    VNum: i.AttachmentVNum,
                    Amount: i.AttachementAmount,
                    Rare: i.AttachementRarity,
                    Upgrade: i.AttachementRarity,
                })
            };
            // SEND ITEM
            await request(sendmailOpt, async (erro, responses, bodi) =>{
                if (erro)
                {
                    console.log(erro);
                    return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
                }
            });

        }

        /* Remove golds */
        try {
            await server.db.request()
                .input('price', sql.Int, items[0].Price)
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
                .input('price', sql.Int, items[0].Price)
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
}

module.exports = get;
