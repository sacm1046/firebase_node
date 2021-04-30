/**
 * Method to process ingredients on recepies, joinning dynamically
 * ingredients data with custom quantity, and calculate dynamically
 * the recepy cost. 
 * @method 
 * @param recepy - Recepy to process
 * @param ingredients - List of all ingredients on system
*/
const processIngredientsRecepy = (recepy, ingredients) => {
    const ingredientIds = recepy.ingredients.map(
        (ingredient) => ingredient.id
      );
      let recepyCost = 0;

      const filteredIngredients = ingredients.filter(({ id }) =>
        ingredientIds.includes(id)
      );

      const filterIngredientByÏd = (id) => {
        return recepy.ingredients.filter(
          (ingredient) => ingredient.id === id
        );
      };

      const precessedIngredients = filteredIngredients.map((ingredient) => {
        const data = filterIngredientByÏd(ingredient.id);
        recepyCost += ingredient.cost * data[0].quantity;
        if (data.length > 0)
          return { ...ingredient, quantity: data[0].quantity };
      });

      return {
        ...recepy,
        ingredients: precessedIngredients,
        cost: recepyCost,
      };
}

module.exports = processIngredientsRecepy;