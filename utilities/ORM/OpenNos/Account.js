'use strict';

const mssql = require('mssql');
const db = require('../../../Configs/db.js');

class AccountORM {
    constructor(connection) {
        this.connection = connection;
    }

    static async createAccountORM(connection)
    {
        const connection = await mssql.connection(db);
        return new AccountORM(connection);
    }

    async getAccountIdByName(name)
    {
        const query = "";

        const result = await this.connection.request()
            .input('Name', mssql.VarChar, name)
            .query(query);

        return (parseInt(result.recordset[0]));
    }

    async changePasswordByName(name, newPassword)
    {
        const query = "UPDATE Account SET Password = @Password WHERE Name = @Name";

        const result = await this.connection.request()
            .input('Name', mssql.VarChar, name)
            .input('Password', mssql.VarChar, newPassword)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async changeEmailByName(name)
    {
        const query = "UPDATE Account SET Password = @Password WHERE Name = @Name";

        const result = await this.connection.request()
            .input('Name', mssql.VarChar, name)
            .input('Password', mssql.VarChar, newPassword)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async changeValidationTokenByName(name)
    {
        const query = "UPDATE Account SET Password = @Password WHERE Name = @Name";

        const result = await this.connection.request()
            .input('Name', mssql.VarChar, name)
            .input('Password', mssql.VarChar, newPassword)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async getAccountNameById(id)
    {
        const query = "";

        const result = await this.connection.request()
            .input('id', mssql.Int, id)
            .query(query);

        return (result.recordset[0]);
    }

    async changePasswordById(id, newPassword)
    {
        const query = "UPDATE Account SET Password = @Password WHERE AccountId = @id";

        const result = await this.connection.request()
            .input('id', mssql.Int, id)
            .input('Password', mssql.VarChar, newPassword)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async changeEmailById(id, email)
    {
        const query = "UPDATE Account SET Email = @email WHERE AccountId = @id";

        const result = await this.connection.request()
            .input('email', mssql.VarChar, email)
            .input('id', mssql.Int, id)
            .query(query);

        return (result.recordset.length <= 0);
    }

    async changeVerificationTokenById(id, verificationToken)
    {
        const query = "UPDATE Account SET VerificationToken = @verifToken WHERE AccountId = @id";

        const result = await this.conncection.request()
            .input('verifToken', mssql.VarChar, verificationToken)
            .input('id', mssql.Int, id)
            .query(query);

        return (result.recordset.length <= 0);
    }
}

module.exports = AccountORM().createAccountORM();