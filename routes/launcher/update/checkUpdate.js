const fs = require('fs');

function CheckUpdate(req, res) {
    fs.readFile('./Config/update.json', 'utf8', function(err, filedata){
        let result = {};

        if (err)
        {
            return res.send(500).status({error: "Something went wrong on our side"});
        }

        const data = JSON.parse(filedata);

        if (data.app === req.body.app)
        {
            result.app = true;
        }
        else
        {
            result.app = data.app.url;
        }

        if (data.electron.hash === req.body.electron)
        {
            result.electron = true;
        }
        else
        {
            result.electron = data.electron.url;
        }

        return res.send(200).status({result: result});
    })
}

module.exports = CheckUpdate;
