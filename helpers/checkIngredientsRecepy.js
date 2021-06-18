const hasData = require("./hasData");

function checkIngredientsRecepy (recepies, ingredientId) {
  if (hasData(recepies)) {
    if (
      recepies.some((recepy) =>
        recepy.ingredients.map((ingredient) => ingredient.id).includes(ingredientId)
      )
    ) {
      return [
        'El ingrediente no puede ser borrado debido a que esta relacionado a una receta existe',
        null,
      ];
    }
  } return [null, true];
};

module.exports = checkIngredientsRecepy;
