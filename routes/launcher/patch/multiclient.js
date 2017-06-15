/**
 * Created by Blowa on 6/15/2017.
 */

exports.module = function (datas) {
    const replacement = [];
    const ptrnMultiClient = [0x0F, 0x85, 0x00, 0x00, 0x00, 0x00, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x48];
    const maskMultiClient = "xx????x????x";
    const replMultiClient = [0xEB, 0x42, 0x90, 0x90, 0x90, 0x90];

    const offset = require("./findPattern").findPatternWithMask(datas, ptrnMultiClient, maskMultiClient);
    if (offset !== -1) {
        for (let i = 0; i < replMultiClient.length; i++)
            replacement.push({
                offset: offset + i,
                data: replMulticlient[i]
            });
    }
};