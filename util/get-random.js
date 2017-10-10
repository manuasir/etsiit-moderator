/**
 * Obtiene n elementos aleatorios de un array con tamaño <= n
 * @param {array} arr Array con los elementos.
 * @param {number} n Número de elementos a obtener del array.
 */
const run = (arr, n) => {
    let result = new Array(n);
    let len    = arr.length;
    let taken  = new Array(len);
    
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
module.exports = run;