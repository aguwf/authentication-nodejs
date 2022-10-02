/**
 * Create an object composed of the picked object properties.
 * @param {Object} obj The source object.
 * @param {...(string|string[])} props The property names to pick, specified
 * individually or in arrays.
 * @returns {Object} Returns the new object.
 * @example
 * const object = { 'a': 1, 'b': '2', 'c': 3 }
 * pick(object, ['a', 'c'])
 * // => { 'a': 1, 'c': 3 }
 */

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;
