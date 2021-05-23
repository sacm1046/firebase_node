/**
 * Method to check if data is null, undefined or if is array
 * the length is 0
 * @method
 * @param value - value to evaluate
 */
const hasData = (value) => {
  if (value === undefined) return false;
  if (value === null) return false;
  if (typeof value === 'number' && value === 0) return false;
  if (typeof value === 'string' && value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
};

module.exports = hasData;
