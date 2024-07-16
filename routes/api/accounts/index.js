const { Prisma } = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {
    async function get(req, res) {
        const result = await db.accounts.findMany({
            select: {
                id: true,
                bank_name: true,
                bank_account_number: true,
                balance: true,
                created_at: true
            }
        });
        await db.$disconnect();
        res.send(result);
    }
    
    async function post(req, res) {
        try {
            await validator.accounts.post().validateAsync(req.body)
            let { user_id, bank_name, bank_account_number, balance } = req.body;
            balance = Number(balance)
            const result = await db.accounts.create({
                select: {
                    id: true,
                    bank_name: true,
                    bank_account_number: true,
                    balance: true,
                    created_at: true
                },
                data: {
                    user_id,
                    bank_name,
                    bank_account_number,
                    balance
                }
            });
            await db.$disconnect();
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
            await validator.accounts.put().validateAsync(req.body)
            let { user_id, bank_name, bank_account_number, balance } = req.body;
            balance = Number(balance)
            const result = await db.accounts.update({
                select: {
                    id: true,
                    bank_name: true,
                    bank_account_number: true,
                    balance: true,
                    created_at: true
                },
                where: { id : id },
                data: {
                    user_id,
                    bank_name,
                    bank_account_number,
                    balance
                }
            });
            await db.$disconnect();
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
            result = await db.accounts.delete({
                where: { id : id }
            });
            await db.$disconnect();
            res.sendStatus(204);
        } catch (err) {
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    async function getOne(req, res) {
        try {
            const id = req.params.id;
            result = await db.accounts.findUnique({
                select: {
                    id: true,
                    bank_name: true,
                    bank_account_number: true,
                    balance: true,
                    created_at: true
                },
                where: { id : id }
            });
            await db.$disconnect();
            res.json(result);
        } catch (err) {
            if(err instanceof Prisma.PrismaClientKnownRequestError) return res.status(400).send(err.meta.cause);
            res.status(500).json(err.message)
        }
    }

    return { get, post, put, remove, getOne };
}

module.exports = main