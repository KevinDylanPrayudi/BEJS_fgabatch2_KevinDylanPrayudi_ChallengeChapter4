const { Prisma } = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {
    async function get(req, res) {
        const result = await db.profiles.findMany({
            select: {
                identity_number: true,
                address: true
            }
        });
        await db.$disconnect();
        res.status(200).json(result);
    }

    async function getOne(req, res) {
        try {
            const id = req.params.id;
            result = await db.profiles.findUnique({
                select: {
                    identity_number: true,
                    address: true
                },
                where: { id : id }
            });
            res.status(200).json(result);
        } catch (err) {
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    return { get, getOne };
}

module.exports = main