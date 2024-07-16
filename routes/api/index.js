const identityTypes = require('./identity-types');

function main(router, db) {
    router.get('/identity-types', identityTypes(db).get);
    router.post('/identity-types', identityTypes(db).post);
    router.put('/identity-types/:id', identityTypes(db).put);
    router.delete('/identity-types/:id', identityTypes(db).remove);
    return router;
}

module.exports = main