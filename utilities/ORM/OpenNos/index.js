'use strict';
const mssql = require('mssql');
const config = require('../../../Config/config.js');

class ORM {
    constructor(connection) {
        this.connection = connection;
    }

    async isAccountAlreadyExist(name)
    {
        const query = 'SELECT TOP 1 Name FROM [dbo].[Account] WHERE [Name] = @Name';
        const result = await this.connection.request()
            .input('Name', mssql.VarChar, name)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async isInBlacklistIp()
    {
        const query = 'SELECT TOP(1) FROM _Banned WHERE [Ip] = @Ip';
        const result = await this.connection.request()
            .input('Ip', mssql.VarChar, name)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async getAllShopPacks() {
        const query = 'SELECT * FROM _CashshopPack';
        const result = await this.connection.request().query(query);
        return (result.recordset);
    }

    async getPackById(id) {
        const query = 'SELECT cp.[PackId], cp.[Name], cp.[Desc], Item.[Name], ci.[ItemVNum], ci.[Quantity] '
            + 'FROM _CashshopPack as cp '
            + 'JOIN _CashshopItem as ci '
            + '  ON cp.[PackId] = ci.[PackId]'
            + 'JOIN Item'
            + '  ON ci.[ItemVNum] = Item.[VNum]'
            + 'WHERE cp.[PackId] = @PackId';
        const result = await this.connection.request()
            .input('PackId', mssql.Int, id)
            .query(query);

        return (result.recordset);
    }

    async addNewPack(pack) {
        const query = 'INSERT INTO _CashshopPack ([Name], [Desc]) VALUES (@Name, @Desc); SELECT SCOPE_IDENTITY() AS id;';

        const result = await this.connection.request()
            .input('Name', mssql.VarChar, pack.name)
            .input('Desc', mssql.VarChar, pack.desc)
            .query(query);

        return (parseInt(result.recordset[0].id));
    }

    async addNewItemToPack(item, packId) {
        const query = 'INSERT INTO _CashshopItem ([PackId], [ItemVNum], [Quantity]) VALUES (@PackId, @ItemVNum, @Quantity);';

        const result = await this.connection.request()
            .input('PackId', mssql.Int, packId)
            .input('ItemVNum', mssql.Int, item.id)
            .input('Quantity', mssql.Int, item.quantity)
            .query(query);

        return (result.recordset);
    }
}

async function createORM() {
    const connection = await mssql.connection(config.db);
    return new ORM(connection);
}

module.exports = createORM();