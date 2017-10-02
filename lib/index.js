// Diseño facade
module.exports = function(bot){
  // Aquí cargamos las interfaces
  require('./estadisticas/estadisticas')(bot);
  require('./general/general')(bot);
  require('./servicios/servicios')(bot);
};