const INFINITY = 9999999

// http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript#12830454#answer-25075575
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#Decimal_rounding

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
function decimalAdjust (type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value)
  }
  value = +value
  exp = +exp
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }
  // Shift
  value = value.toString().split('e')
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
  // Shift back
  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
}

// Decimal round
function round10 (value, exp) {
  return decimalAdjust('round', value, exp)
}

/*
// Decimal floor
function floor10 (value, exp) {
  return decimalAdjust('floor', value, exp)
}
// Decimal ceil
function ceil10 (value, exp) {
  return decimalAdjust('ceil', value, exp)
}
*/

function getDistanceForPresentation (kilometers) {
  if (kilometers === INFINITY) return 'unknown'

  let miles = kilometers / 1.609 // kilometers per mile
  miles = round10(miles, -1) // Round to one decimal place
  return parseFloat(miles.toFixed(1))
}

export default getDistanceForPresentation
