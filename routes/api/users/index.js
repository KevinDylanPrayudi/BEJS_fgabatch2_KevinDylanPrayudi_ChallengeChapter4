const { Prisma } = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {
    async function get(req, res) {
        const result = await db.users.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        await db.$disconnect();
        res.send(result);
    }
    
    async function post(req, res) {
        try {
            await validator.users.post().validateAsync(req.body)
            const result = await db.users.create({
                data: {
                    ...req.body
                }
            });
            await db.$disconnect();
            result.id = Number(result.id)
            res.json(result);
        } catch (err) {
            if(err.isJoi) return res.status(400).send(err.details[0].message);
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }
    
    async function put(req, res) {
        try {
            const id = req.params.id;
            await validator.users.put().validateAsync(req.body)
            const result = await db.users.update({
                where: { id : id },
                data: {
                    ...req.body
                }
            });
            await db.$disconnect();
            result.id = Number(result.id)
            res.json(result);
        } catch (err) {
            if(err.isJoi) return res.status(400).send(err.details[0].message);
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }
    
    async function remove(req, res) {
        try {
            const id = req.params.id;
            console.log(id)
            result = await db.users.delete({
                where: { id : id }
            });
            res.sendStatus(204);
        } catch (err) {
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    async function getOne(req, res) {
        try {
            const id = req.params.id;
            result = await db.users.findUnique({
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                where: { id : id }
            });
            res.json(result);
        } catch (err) {
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    return { get, post, put, remove, getOne };
}

module.exports = main