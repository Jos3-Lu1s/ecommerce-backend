// Recorre el arreglo en orden y espera (await) a que termine el callback de cada elemento
// antes de pasar al siguiente. A diferencia de Array.forEach, respeta las funciones async.
// callback recibe (elemento, índice, arreglo).
module.exports = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
