module.exports = (arr, n) => {
    let result = new Array(n),
        len    = arr.length,
        taken  = new Array(len);
    if (n > len) {
        throw Error('getRandom: more elements taken than available');
    }
    while (n--) {
        let x     = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x]  = --len;
    }
    return result;
};