'use strict';

const mssql = require('mssql');
const db = require('../../../Configs/db.js');

class LogORM {
    async constructor() {
        this.connection = await mssql.connection(db);
    }
}

module.exports = new LogORM();