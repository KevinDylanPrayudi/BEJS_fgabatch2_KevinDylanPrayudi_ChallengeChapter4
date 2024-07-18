const Prisma = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./models/transfer');

function main(db) {

    async function sender(req, res) {
        const result = await model(db).sender(req.params.id);

        res.status(200).json(result);
    }

    async function recepient(req, res) {
        const result = await model(db).recepient(req.params.id);
        
        res.status(200).json(result);
    }

    async function post(req, res) {

        try {
            await validator().transfer().validateAsync(req.body)
            const result = await model(db).post(req.body);
                
            res.status(201).json(result);
        } catch (err) {
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    let name;
                    if (err.meta.field_name == 'Transactions_transaction_type_id_fkey (index)'){
                        name = 'transaction_type_id';
                    } else if (err.meta.field_name == 'Transactions_destination_account_id_fkey (index)') {
                        name = 'destination_account_id';
                    }

                    return res.status(400).json(`The ${name} doesn't exists in other table.`);
                }

                if (err.code === 'P2025') {
                    return res.status(400).json(`The source_account_id doesn't exists in other table.`);
                }

                return res.status(400).send(err.meta.cause);
            }
            res.status(400).json(err.message);
        }
    }

    async function getOne(req, res) {
        const result = await model(db).getOne(req.params.id);
        
        res.status(200).json(result);
    }

    return { sender, recepient, post, getOne }
}

module.exports = main