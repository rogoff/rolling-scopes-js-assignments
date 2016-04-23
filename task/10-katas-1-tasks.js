'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N', 'E', 'S', 'W'];  // use array of cardinal directions only!
    let arr = [];

    for (let i = 0; i <= 315; i+= 11.25) {
        //NbW, N, NbE, ..., EbN, E, EbS, ... , SbE, S, SbW, ...., WbS, W, WbN ....
        if (i % 90 === 0) {
            if (i === 0) {
                arr[(360 - 11.25) / 11.25] = {
                    abbreviation: `${sides[i]}b${sides[(360 - 90) / 90]}`,
                    azimuth: (360 - 11.25)
                };
            } else {
                arr[(i - 11.25) / 11.25] = {
                    abbreviation: `${sides[i / 90]}b${sides[(i - 90) / 90]}`,
                    azimuth: i - 11.25
                };
            }
            arr[i / 11.25] = {
                abbreviation: sides[i / 90],
                azimuth: i
            };
            if ((i + 90) === 360) {
                arr[(i + 11.25) / 11.25] = {
                    abbreviation: `${sides[i / 90]}b${sides[0]}`,
                    azimuth: i + 11.25
                };
            } else {
                arr[(i + 11.25) / 11.25] = {
                    abbreviation: `${sides[i / 90]}b${sides[(i + 90) / 90]}`,
                    azimuth: i + 11.25
                };
            }
            //..., NEbN, NE, NEbE, ..., SEbE, SE, SEbS, ... , SWbS, SW, SWbW, ...., NWbW, NW, NWbN ....
        } else if ((i % 45 === 0) && ((i % 90) !== 0)) {
            if (Math.floor(i / 90) % 2 === 0) {
                arr[(i - 11.25)/ 11.25] = {
                    abbreviation: `${sides[(i - 45) / 90]}${sides[(i + 45) / 90]}b${sides[(i - 45) / 90]}`,
                    azimuth: i - 11.25
                };
                arr[i / 11.25] = {
                    abbreviation: `${sides[(i - 45) / 90]}${sides[(i + 45) / 90]}`,
                    azimuth: i
                };
                arr[(i + 11.25)/ 11.25] = {
                    abbreviation: `${sides[(i - 45) / 90]}${sides[(i + 45) / 90]}b${sides[(i + 45) / 90]}`,
                    azimuth: i + 11.25
                };
            } else if ((i + 45) === 360) {
                arr[(i - 11.25)/ 11.25] = {
                    abbreviation: `${sides[0]}${sides[(i - 45) / 90]}b${sides[(i - 45) / 90]}`,
                    azimuth: i - 11.25
                };
                arr[i / 11.25] = {
                    abbreviation: `${sides[0]}${sides[(i - 45) / 90]}`,
                    azimuth: i
                };
                arr[(i + 11.25)/ 11.25] = {
                    abbreviation: `${sides[0]}${sides[(i - 45) / 90]}b${sides[0]}`,
                    azimuth: i + 11.25
                };
            } else {
                arr[(i - 11.25)/ 11.25] = {
                    abbreviation: `${sides[(i + 45) / 90]}${sides[(i - 45) / 90]}b${sides[(i - 45) / 90]}`,
                    azimuth: i - 11.25
                };
                arr[i / 11.25] = {
                    abbreviation: `${sides[(i + 45) / 90]}${sides[(i - 45) / 90]}`,
                    azimuth: i
                };
                arr[(i + 11.25)/ 11.25] = {
                    abbreviation: `${sides[(i + 45) / 90]}${sides[(i - 45) / 90]}b${sides[(i + 45) / 90]}`,
                    azimuth: i + 11.25
                };
            }
        }
    }

    //NNE, ... ENE, ....
    for (let i = 0; i <= 348.75; i+= 11.25) {
        if ((i % 22.5 === 0) && ((i % 45) !== 0)) {
            if (Math.floor(i / 45) % 2 === 0) {
                arr[i / 11.25] = {
                    abbreviation: `${sides[(i - 22.5) / 90]}${arr[(i + 22.5) / 11.25].abbreviation}`,
                    azimuth: i
                };
            } else if ((i + 22.5) === 360) {
                arr[i / 11.25] = {
                    abbreviation: `${sides[0]}${arr[(i - 22.5) / 11.25].abbreviation}`,
                    azimuth: i
                };
            } else {
                arr[i / 11.25] = {
                    abbreviation: `${sides[(i + 22.5) / 90]}${arr[(i - 22.5) / 11.25].abbreviation}`,
                    azimuth: i
                };
            }
        }
    }
    return arr;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    throw new Error('Not implemented');
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    throw new Error('Not implemented');
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    throw new Error('Not implemented');
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    throw new Error('Not implemented');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
