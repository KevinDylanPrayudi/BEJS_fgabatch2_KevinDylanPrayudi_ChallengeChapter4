const { Prisma } = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./model');

function main(db) {
    async function get(req, res) {
        let result = await model(db).get();

        if (result === null) {
            result = {
                message: 'Data profile is empty'
            }
        }

        res.status(200).json(result);
    }

    async function getOne(req, res) {
        try {
            await validator().params().validateAsync({ id:req.params.id })
            const result = await model(db).getOne(req.params.id);
            
            res.status(200).json(result);
        } catch (err) {
            if(err.isJoi) return res.status(400).send(err.details[0].message);
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    return { get, getOne };
}

module.exports = main