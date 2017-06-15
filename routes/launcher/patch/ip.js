/**
 * Created by Blowa on 6/15/2017.
 */
exports.modules = function (data, ip) {
    let replacement = [];
    const ptrnHost = [0x65, 0x73, 0x74, 0x00, 0xFF, 0xFF, 0xFF, 0xFF];

    let offset = require("./findPattern.js").findPattern(datas, ptrnHost);
    if (offset !== -1) {
        offset += ptrnHost.length;
        replacement.push({
            offset: offset,
            data: ip.length
        });
        offset += 4;
        for (let i = 0; i < ip.length; i++) {
            replacement.push({
                offset: offset + i,
                data: ip[i]
            });
        }
        for (let i = ip.length; i < 15; i++) {
            replacement.push({
                offset: offset + i,
                data: 0
            });
        }
        offset += 20;
        replacement.push({
            offset: offset,
            data: ip.length
        });
        offset += 4;
        for (let i = 0; i < ip.length; i++) {
            replacement.push({
                offset: offset + i,
                data: ip[i]
            });
        }
        for (let i = ip.length; i < 15; i++) {
            replacement.push({
                offset: offset + i,
                data: 0
            });
        }
    }
    return (replacement);
};