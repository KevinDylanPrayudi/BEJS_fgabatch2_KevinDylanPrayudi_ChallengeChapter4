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
        res.status(200).json(result);
    }

    async function post(req, res) {
        try {
            await validator.users.post().validateAsync(req.body)
            const { name, email, password, identity_type_id, identity_number, address } = req.body;
            const result = await db.users.create({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profile: {
                        select: {
                            identity_number: true,
                            address: true
                        }
                    }
                },
                data: {
                    name,
                    email,
                    password,
                    profile: {
                        create: {
                            identity_type_id,
                            identity_number,
                            address
                        }
                    }
                }
            });
            await db.$disconnect();
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
            if (err instanceof Prisma.PrismaClientUnknownRequestError) {
                console.log(err.code)
            }
            res.status(500).json(err.message)
        }
    }

    async function put(req, res) {
        try {
            const id = req.params.id;
            await validator.users.put().validateAsync(req.body)
            const { name, email, password, identity_type_id, identity_number, address } = req.body;
            const result = await db.users.update({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profile: {
                        select: {
                            identity_number: true,
                            address: true
                        }
                    }
                },
                data: {
                    name,
                    email,
                    password,
                    profile: {
                        update: {
                            identity_type_id,
                            identity_number,
                            address
                        }
                    }
                },
                where: { id: id }
            });
            await db.$disconnect();
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
            const id = req.params.id;
            console.log(id)
            result = await db.users.delete({
                where: { id: id }
            });
            await db.$disconnect();
            res.sendStatus(204);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    return res.status(400).json('The data is being used by another table');
                }
                return res.status(400).send(err.meta.cause);
            }
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
                where: { id: id }
            });
            await db.$disconnect();
            res.status(200).json(result);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    return { get, post, put, remove, getOne };
}

module.exports = main