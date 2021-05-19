const hasData = require('./hasData');

/**
 * Method to translate english keys to spanish, for
 * message in errors
 * @method
 * @param key - English key to translate
*/
function translateKeys(key) {
  return {
    'cost': 'Costo',
    'name': 'Nombre',
    'type': 'Unidad',
    'ingredients': 'Ingredientes'
  }[key];
}

/**
 * Method to validate empty string and array fields, 0 values
 * or undefineds in body request from client, manage errors
 * and return data object to database.
 * @method
 * @param body - request body from client
 * @param res - response from client
 * @param exceptions - array of exceptions to evaluate on validations
*/
function validations(body, res, exceptions) {
  const bodyKeys = Object.keys(body);
  let data = {};
  bodyKeys.forEach((key) => {
    if (!hasData(body[key]) && !exceptions.includes(key)) {
      return res
        .status(400)
        .json({ error: `${translateKeys(key)} es requerido` });
    }
    data = { ...data, [key]: body[key] };
  });
  return data;
}

module.exports = {
  validations,
};
