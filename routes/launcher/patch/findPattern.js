/**
 * Created by Blowa on 6/15/2017.
 */

function match(haystack, needle, start) {
    if (needle.length + start > haystack.length)
        return false;
    for (let i = 0; i < needle.length; i++) {
        if (needle[i] !== haystack[i + start])
            return false;
    }
    return (true);
}

function matchWithMask(haystack, needle, mask, start) {
    if (needle.length + start > haystack.length)
        return false;
    for (let i = 0; i < needle.length; i++) {
        if (mask[i] === 'x' && needle[i] !== haystack[i + start])
            return false;
    }
    return (true);
}

function findPattern(src, key) {
    for (let i = 0; i <= src.length - key.length; i++)
        if (match(src, key, i))
            return i;
    return -1;
}

function findPatternWithMask(src, pattern, mask) {
    for (let i = 0; i <= src.length - pattern.length; i++)
        if (matchWithMask(src, pattern, mask, i))
            return i;
    return -1;
}

module.exports = { findPattern, findPatternWithMask };
