'use strict';

const mssql = require('mssql');
const tables = require('../../../Confgs/tables');
const db = require('../../../Configs/db.js');

class CharacterORM {
    async constructor() {
        this.connection = await mssql.connection(db);
    }

    async getCharacterById(id)
    {
        const query = "SELECT TOP(1) FROM ";

        const result = this.connection.requeest()
            .input('', mssql.Int, id)
            .query(query);

        const character = result.recordset[0];

        return (character);
    }

    async getCharacterIdByName(name)
    {
        const query = "";

        const result = this.connection.request()
            .input('name', mssql.VarChar, name)
            .query(query);

        return (parseInt(result.recordset[0]));
    }
}

module.exports = new CharacterORM();