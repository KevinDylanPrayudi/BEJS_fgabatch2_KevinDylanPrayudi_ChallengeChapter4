const { Prisma } = require('@prisma/client');

const { validator } = require('./validator');
const model = require('./model');

function main(db) {
    async function get(req, res) {
        let result = await model(db).get();

        if (result === null) {
            result = {
                message: 'Data users is empty'
            }
        }
        
        res.status(200).json(result);
    }

    async function post(req, res) {
        try {
            await validator().post().validateAsync(req.body)
            const result = await model(db).post(req.body);

            res.status(201).json(result);
        } catch (err) {
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json(`${err.meta.target[0]} already exists`);
                } else if (err.code === 'P2003') {
                    return res.status(400).json('Identity number not exists');
                }
                return res.status(400).json(err.meta.cause);
            }
            res.status(500).json(err.message)
        }
    }

    async function put(req, res) {
        try {
            await validator().put().validateAsync(req.body)
            const result = await model(db).put(req.params.id, req.body);

            res.status(202).json(result);
        } catch (err) {
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json(`${err.meta.target[0]} already exists`);
                } else if (err.code === 'P2003') {
                    return res.status(400).json('Identity number not exists');
                }
                return res.status(400).json(err.meta.cause);
            }
            res.status(500).json(err.message)
        }
    }

    async function remove(req, res) {
        try {
            await model(db).remove(req.params.id);
            
            res.sendStatus(204);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    async function getOne(req, res) {
        try {
            const result = await model(db).getOne(req.params.id);
            
            res.status(200).json(result);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    return { get, post, put, remove, getOne };
}

module.exports = main