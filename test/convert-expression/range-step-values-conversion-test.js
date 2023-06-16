'use strict';

const { expect } = require('chai');
const rangeConversion = require('../../src/convert-expression/range-conversion');
const stepConversion = require('../../src/convert-expression/step-values-conversion');

describe('range-conversion.js with step-values-conversion.js', () => {
    it('should convert range with step values', () => {
        var expressions = '1-59/5 3-49/10 * * * *'.split(' ');
        expressions = rangeConversion(expressions);
        expressions = stepConversion(expressions, [true, true, false, false, false, false]);
        expect(expressions[0]).to.equal('1,6,11,16,21,26,31,36,41,46,51,56');
        expect(expressions[1]).to.equal('3,13,23,33,43');
    });
});
