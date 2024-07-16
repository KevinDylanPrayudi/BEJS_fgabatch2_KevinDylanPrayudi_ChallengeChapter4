const identityTypes = require('./identity-types');
const users = require('./users');
const accounts = require('./accounts');

function main(router, db) {
    router.get('/identity-types', identityTypes(db).get);
    router.post('/identity-types', identityTypes(db).post);
    router.put('/identity-types/:id', identityTypes(db).put);
    router.delete('/identity-types/:id', identityTypes(db).remove);
    
    router.get('/users', users(db).get);
    router.get('/users/:id', users(db).getOne);
    router.post('/users', users(db).post);
    router.put('/users/:id', users(db).put);
    router.delete('/users/:id', users(db).remove);

    router.get('/accounts', accounts(db).get);
    router.get('/accounts/:id', accounts(db).getOne);
    router.post('/accounts', accounts(db).post);
    router.put('/accounts/:id', accounts(db).put);
    router.delete('/accounts/:id', accounts(db).remove);
  
    return router;
}

module.exports = main