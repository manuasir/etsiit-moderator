const chai      = require('chai');
const getRandom = require('../util/get-random');
chai.should();

describe('get-random.js',() => {
    it('#getRandom()',() => {
        const array  = [12,13,14,15,16];
        const random = getRandom(array,3);
        random.length.should.be.equal(3);
        random.filter(e => array.includes(e)).length.should.be.equal(3);
    });
 });