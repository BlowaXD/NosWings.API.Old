/**
 ________                     ___________.__       .__       .___
 /  _____/_____    _____   ____\_   _____/|__| ____ |  |    __| _/
 /   \  ___\__  \  /     \_/ __ \|    __)  |  |/ __ \|  |   / __ |
 \    \_\  \/ __ \|  Y Y  \  ___/|     \   |  \  ___/|  |__/ /_/ |
 \______  (____  /__|_|  /\___  >___  /   |__|\___  >____/\____ |
 \/     \/      \/     \/    \/            \/           \/

 */

const sql = require('mssql');
const ADD_MONEY_QUERY = 'UPDATE a SET Money = Money + @addMoney FROM _GF_CS_Accounts AS a JOIN [Character] AS c ON c.AccountId = a.AccountId WHERE c.Name = @characterName;';
const ADD_ACCOUNT = 'INSERT INTO [opennos].[dbo].[_GF_CS_Accounts] ([AccountId], [Money], [Permissions]) VALUES (@AccountId, 0, 0);';
const GET_ACCOUNT = 'SELECT AccountId FROM [_GF_CS_Accounts] AS acc JOIN [Character] AS character ON character.AccountId = a.AccountId WHERE character.Name = @characterName;';
const GET_ACCOUNTID = 'SELECT AccountId FROM [Character] WHERE Name = @characterName;';

async function post(req, res) {
    const server = global.config.servers[req.body.server || 'NosWings'];
    const account = {
        Money: req.body.money,
        Character: req.body.character
    };

    if (!account || !account.Money || !account.Character) {
        return res.sendStatus(400);
    }

    let recordset;

    try {
        const request = await server.db.request()
            .input('characterName', sql.VarChar, account.Character)
            .query(`${GET_ACCOUNT}`);
        recordset = request.recordset || [];
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    if (recordset.length === 0) {
        let accountId;
        try {
            const request = await server.db.request()
                .input('characterName', sql.VarChar, account.Character)
                .query(`${GET_ACCOUNTID}`);
            accountId = request.recordset || [];
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
        }
        try {
            await server.db.request()
                .input('AccountId', sql.Int, accountId)
                .query(`${ADD_ACCOUNT}`);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
        }
    }

    try {
        const request = await server.db.request()
            .input('addMoney', sql.Int, account.Money)
            .input('characterName', sql.VarChar, account.Character)
            .query(`${ADD_MONEY_QUERY}`);
        recordset = request.recordset || [];
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    return res.status(200).send({success: true});
}

module.exports = post;
