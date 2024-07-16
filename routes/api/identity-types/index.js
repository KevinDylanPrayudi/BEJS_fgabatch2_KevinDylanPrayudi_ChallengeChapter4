const { Prisma } = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {
    async function get(req, res) {
        const result = await db.identity_Types.findMany();
        result.forEach(element => {
            element.id = Number(element.id)
        });
        await db.$disconnect();
        res.send(result);
    }
    
    async function post(req, res) {
        try {
            await validator.identityTypes.post().validateAsync(req.body)
            const { identity_type_name } = req.body;
            const result = await db.identity_Types.create({
                select: {
                    identity_type_name: true
                },
                data: {
                    identity_type_name
                }
            });
            await db.$disconnect();
            result.id = Number(result.id)
            res.json(result);
        } catch (err) {
            if(err.isJoi) return res.status(400).send(err.details[0].message);
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.message);
            res.status(500).json(err.message)
        }
    }
    
    async function put(req, res) {
        try {
            await validator.identityTypes.put().validateAsync(req.body)
            const { identity_type_name } = req.body;
            const id = Number(req.params.id);
            const result = await db.identity_Types.update({
                select: {
                    identity_type_name: true
                },
                where: { id : id },
                data: {
                    identity_type_name
                }
            });
            await db.$disconnect();
            result.id = Number(result.id)
            res.json(result);
        } catch (err) {
            if(err.isJoi) return res.status(400).send(err.details[0].message);
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.message);
            res.status(500).json(err.message)
        }
    }
    
    async function remove(req, res) {
        try {
            const id = Number(req.params.id);
            result = await db.identity_Types.delete({
                where: { id : id }
            });
            res.sendStatus(204);
        } catch (err) {
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.message);
            res.status(500).json(err.message)
        }
    }

    return { get, post, put, remove };
}

module.exports = main