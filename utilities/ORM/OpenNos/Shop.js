'use strict';

const mssql = require('mssql');
const db = {
    server: 'XXXXXXXXXXXXXXXXXX',
    user: 'XXXXXXXXXXXXXXX',
    password: 'XXXXXXXXXXXXXXXX',
    database: 'XXXXXXXXXXXXXX'
};

class ShopORM {
    async constructor() {
        this.connection = await mssql.connection(db);
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

module.exports = new ShopORM();