const LAST_5_NEWS = "SELECT TOP 5 [dbo].[_GF_CS_News].[Id], [Title], [Image], [Description], [Tag], [Date], [Link] FROM [dbo].[_GF_CS_News] ORDER BY [Id] DESC;";

async function getNews (req, res) {

    const server = global.config.servers[req.query.server];
    /* Await the BD connection & check if account exists */
    let recordset;
    try {
        const request = await server.db.request()
            .query(LAST_5_NEWS);
        recordset = request.recordset || [];
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({success: false, error: global.translate.ERROR_IN_DATABASE});
    }

    console.log(recordset);

    /* If not, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send({success: false, error: global.translate.ERROR_IN_DATABASE});


    return res.send({
        success: true,
        recordset
    });
}

module.exports = getNews;