'use strict';

const monthNamesConversion = require('./month-names-conversion');
const weekDayNamesConversion = require('./week-day-names-conversion');
const convertAsterisksToRanges = require('./asterisk-to-range-conversion');
const convertRanges = require('./range-conversion');
const convertSteps = require('./step-values-conversion');

module.exports = (() => {

    function appendSecondExpression(expressions){
        if(expressions.length === 5){
            return ['0'].concat(expressions);
        }
        return expressions;
    }

    function removeSpaces(str) {
        return str.replace(/\s{2,}/g, ' ').trim();
    }

    // Function that takes care of normalization.
    function normalizeIntegers(expressions) {
        for (let i=0; i < expressions.length; i++){
            const numbers = expressions[i].split(',');
            for (let j=0; j<numbers.length; j++){
                numbers[j] = parseInt(numbers[j]);
            }
            expressions[i] = numbers;
        }
        return expressions;
    }

    // Treat step as "nth" if first value of range is not the
    // zeroth value of valid expression range and step has been defined
    function defineIfStepShouldBeTreatedAsNth(expressions) {
        var rangeWithStepValuePattern = /^([0-9]{0,2})-([0-9]{0,2})\/([0-9]{0,2})$/;

        const zeroIndexValueMap = {
            0:0,
            1:0,
            2:0,
            3:1,
            4:1,
            5:0,
        };

        const treatStepAsNth = [];

        for(var i = 0; i < expressions.length; i++){
            var match = rangeWithStepValuePattern.exec(expressions[i]);
            var isRangeWithStepValue = match !== null && match.length > 0;

            if(isRangeWithStepValue) {
                var expressionStartsAtZerothIndex = zeroIndexValueMap[i] === parseInt(match[1]);

                if(expressionStartsAtZerothIndex) {
                    treatStepAsNth.push(false);
                } else {
                    treatStepAsNth.push(true);
                }
            } else {
                treatStepAsNth.push(false);
            }
        }

        return treatStepAsNth;
    }

    /*
     * The node-cron core allows only numbers (including multiple numbers e.g 1,2).
     * This module is going to translate the month names, week day names and ranges
     * to integers relatives.
     *
     * Month names example:
     *  - expression 0 1 1 January,Sep *
     *  - Will be translated to 0 1 1 1,9 *
     *
     * Week day names example:
     *  - expression 0 1 1 2 Monday,Sat
     *  - Will be translated to 0 1 1 1,5 *
     *
     * Ranges example:
     *  - expression 1-5 * * * *
     *  - Will be translated to 1,2,3,4,5 * * * *
     */
    function interprete(expression){
        let expressions = removeSpaces(expression).split(' ');
        expressions = appendSecondExpression(expressions);
        expressions[4] = monthNamesConversion(expressions[4]);
        expressions[5] = weekDayNamesConversion(expressions[5]);
        expressions = convertAsterisksToRanges(expressions);
        let treatStepAsNth = defineIfStepShouldBeTreatedAsNth(expressions);
        expressions = convertRanges(expressions);
        expressions = convertSteps(expressions,treatStepAsNth);

        expressions = normalizeIntegers(expressions);

        return expressions.join(' ');
    }

    return interprete;
})();
