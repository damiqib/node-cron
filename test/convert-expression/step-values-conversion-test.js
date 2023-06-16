'use strict';

const { expect } = require('chai');
const conversion = require('../../src/convert-expression/step-values-conversion');

describe('step-values-conversion.js', () => {
    it('should convert step values', () => {
        var expressions = '1,2,3,4,5,6,7,8,9,10/2 0,1,2,3,4,5,6,7,8,9/5 0,3,4,5,6,7,8,9,10/2 * * *'.split(' ');
        expressions = conversion(expressions, [true, false, false, false, false, false]);
        expect(expressions[0]).to.equal('1,3,5,7,9');
        expect(expressions[1]).to.equal('0,5');
        expect(expressions[2]).to.equal('0,4,6,8,10');
    });

    it('should throw an error if step value is not a number', () => {
        var expressions = '1,2,3,4,5,6,7,8,9,10/someString 0,1,2,3,4,5,6,7,8,9/5 * * * *'.split(' ');
        expect(() => conversion(expressions, [false, false, false, false, false, false])).to.throw('someString is not a valid step value');
    });
});
