const Configstore = require('configstore');
let config = null;

function initCof(namespace) {
    config = new Configstore(namespace);
}

function getConf(name) {
    return config.get(name)
}

function setConf(name, value) {
    config.set(name, value);
}

function delCof(name) {
    config.delete(name);
}

module.exports = {
    initCof,
    getConf,
    setConf,
    delCof,
};