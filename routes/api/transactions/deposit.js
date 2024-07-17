const Prisma = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {
    
    async function get(req, res) {
        const result = await db.transactions.findMany({
            select: {
                id: true,
                amount: true,
                date: true,
                destination_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            where: {
                destination_account_id: req.params.id,
                transaction_type: {
                    transaction_type_name: "deposit"
                }
            }
        });
        await db.$disconnect();
        res.status(200).json(result);
    }

    async function post(req, res) {
        try {
            await validator.transactions.deposit().validateAsync(req.body)
            const { amount, destination_account_id, transaction_type_id } = req.body;
            const result = await db.$transaction(
                [
                    db.transactions.create({
                        select: {
                            id: true,
                            amount: true,
                            date: true,
                            destination_account_id: true,
                            transaction_type: {
                                select: {
                                    transaction_type_name: true
                                }
                            }
                        },
                        data: {
                            amount: Number(amount),
                            destination_account_id,
                            transaction_type_id: Number(transaction_type_id)
                        }
                    }),
                    db.accounts.update({
                        where: {
                            id: destination_account_id
                        },
                        data: {
                            balance: {
                                increment: Number(amount)
                            }
                        }
                    })
                ],
                {
                    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
                }
            );

            await db.$disconnect();
            res.status(201).json(result);
        } catch (err) {
            console.log(err)
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    return res.status(400).json(`The ${err.meta.field_name == 'Transactions_transaction_type_id_fkey (index)' ? 'transaction_type_id' : 'source_account_id'} doesn't exists in other table.`);
                }

                return res.status(400).send(err.meta.cause);
            }
            res.status
            res.status(500).json(err.message)
        }
    }

    async function getOne(req, res) {
        const result = await db.transactions.findFirst({
            select: {
                id: true,
                amount: true,
                date: true,
                destination_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            where: {
                id: req.params.id,
                transaction_type: {
                    transaction_type_name: "deposit"
                }
            }
        });
        await db.$disconnect();
        res.status(200).json(result);
    }

    return { get, post, getOne };
}

module.exports = main