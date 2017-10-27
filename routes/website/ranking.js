'use strict';
const TOP_50_LEVEL = "SELECT TOP 50 [dbo].[Character].[Name], [Class], [Gender], [Level], [HeroLevel], [LevelXp], [Reput] FROM [dbo].[Character] INNER JOIN Account acc ON acc.AccountId = [Character].AccountId WHERE acc.Authority < 5 ORDER BY [Level] DESC, [LevelXp] DESC;";
const TOP_50_REPUT = "SELECT TOP 50 [dbo].[Character].[Name], [Class], [Gender], [Level], [HeroLevel], [LevelXp], [Reput] FROM [dbo].[Character] INNER JOIN Account acc ON acc.AccountId = [Character].AccountId WHERE acc.Authority < 5 ORDER BY [Reput] DESC";

function getClassByClassAndGender(characterClass, sex) {
    switch (characterClass) {
        case 0:
            return (sex === 0 ? "MALE_ADVENTURER" : "FEMALE_ADVENTURER");
            break;
        case 1:
            return (sex === 0 ? "MALE_SWORD" : "FEMALE_SWORD");
            break;
        case 2:
            return (sex === 0 ? "MALE_ARCHER" : "FEMALE_ARCHER");
            break;
        case 3:
            return (sex === 0 ? "MALE_WIZARD" : "FEMALE_WIZARD");
            break;
        default:
            return (sex === 0 ? "MALE" : "FEMALE");
    }
}

async function getTopRank(req, res) {

    const server = global.config.servers[req.query.server || "NosWings"];
    let rankingQuery;
    switch (req.params.rankingType) {
        case "level":
            rankingQuery = TOP_50_LEVEL;
            break;
        case "reput":
            rankingQuery = TOP_50_REPUT;
            break;
        case "fxp":
            rankingQuery = TOP_50_LEVEL;
            break;
        case "pvp":
            rankingQuery = TOP_50_LEVEL;
            break;
        case "donator":
            rankingQuery = TOP_50_LEVEL;
            break;
            default:
            rankingQuery = TOP_50_LEVEL;
            break;
    }
    /* Await the BD connection & check if account exists */
    let recordset;
    try {
        const request = await server.db.request()
            .query(rankingQuery);
        recordset = request.recordset || [];
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error: global.translate.ERROR_IN_DATABASE
        });
    }

    /* If not, throw an error */
    if (recordset.length <= 0)
        return res.status(403).send({
            success: false,
            error: global.translate.ERROR_IN_DATABASE
        });

    return res.send({
        success: true,
        data: recordset.map(s => new Object({
            Name: s.Name,
            Level: s.Level,
            LevelXp: s.LevelXp,
            HeroLevel: s.HeroLevel,
            Reputation: s.Reput,
            Class: getClassByClassAndGender(s.Class, s.Gender),
        }))
    });
}

module.exports = getTopRank;