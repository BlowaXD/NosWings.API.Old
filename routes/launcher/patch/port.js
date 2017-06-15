/**
 * Created by Blowa on 6/15/2017.
 */

exports.module = function (data, port) {
    let replacement = [];
    const ptrnPort = [0x8B, 0x0D, 0x00, 0x00, 0x00, 0x00, 0x8B, 0x09, 0x8B, 0x15, 0x00, 0x00, 0x00, 0x00, 0x8B, 0x12, 0xE8, 0x00, 0x00, 0x00, 0x00, 0xC3];
    const maskPort = "xx????xxxx????xxx????x";
    const replaceBytes = [0xB9, 0x00, 0x00, 0x90, 0x90, 0x90];

    let offset = require("./findPattern.js").findPatternWithMask(datas, ptrnPort, maskPort);
    replaceBytes.insert(1, port.toUInt8 && 0xFF00 >> 8);
    replaceBytes.insert(1, port.toUInt8 & 0xFF);
    if (offset !== -1) {
        for (let i = 0; i < replaceBytes.length; i++) {
            replacement.push({
                offset: offset + i,
                data: replaceBytes[i]
            })
        }
    }
    return replacement;
};