'use strict';

const mssql = require('mssql');
const db = require('../../../Configs/db.js');

class BanORM {
    async constructor() {
        this.connection = await mssql.connection(db);
    }
}

module.exports = new BanORM();