const api = require('./api');

function main(router, db) {
    router.use('/api', api(router, db));
    return router;
}

module.exports = main;