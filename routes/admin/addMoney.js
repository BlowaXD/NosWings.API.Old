/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */

const sql = require('mssql');
const ADD_MONEY_QUERY = 'UPDATE a\n' +
    'SET Money = Money + @addMoney\n' +
    'FROM _GF_CS_Accounts AS a\n' +
    'JOIN [Character] AS c\n' +
    '    ON c.AccountId = a.AccountId\n' +
    'WHERE c.Name = @characterName'


async function post(req, res) {
    const server = global.config.servers[req.body.server || 'NosWings'];
    const account = {
        Money: req.body.money,
        Character: req.body.Character
    };

    if (!account || !account.Money || !account.Character) {
        return res.sendStatus(400);
    }

    /* Await the BD connection & UPLOAD A NEW PATCH IF HASH IS NOT TAKEN */
    try {
        const request = await server.db.request()
            .input('addMoney', sql.int, account.Money)
            .input('characterName', sql.VarChar, account.Character)
            .query(`${ADD_MONEY_QUERY}`);
        recordset = request.recordset || [];
    }
    catch (error) {
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    return res.status(200).send({success: true});
}

module.exports = post;
