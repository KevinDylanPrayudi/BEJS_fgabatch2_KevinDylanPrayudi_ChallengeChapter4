const router = require('express').Router();
const deposit = require('./deposit');
const withdraw = require('./witdraw');

function main(db) {
    router.get('/deposits/:id', deposit(db).get);
    router.post('/deposits/', deposit(db).post);
    router.get('/deposit/:id', deposit(db).getOne);

    router.get('/withdraws/:id', withdraw(db).get);
    router.post('/withdraws/', withdraw(db).post);
    router.get('/withdraw/:id', withdraw(db).getOne);

    return router;
}

module.exports = main