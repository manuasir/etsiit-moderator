module.exports = (bot) => {
    require('./estadisticas/estadisticas')(bot);
    require('./general/general')(bot);
    require('./servicios/servicios')(bot);
};
