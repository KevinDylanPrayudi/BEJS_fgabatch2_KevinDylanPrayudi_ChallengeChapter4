const Prisma = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {
    
    async function get(req, res) {
        const result = await db.transactions.findMany({
            select: {
                id: true,
                amount: true,
                date: true,
                source_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            where: {
                source_account_id: req.params.id,
                transaction_type: {
                    transaction_type_name: "withdraw"
                }
            }
        });
        await db.$disconnect();
        res.status(200).json(result);
    }

    async function post(req, res) {
        try {
            await validator.transactions.withdraw().validateAsync(req.body)
            const { amount, source_account_id, transaction_type_id } = req.body;

            const result = await db.$transaction(async (tx) => {
                
                const withdraw = await tx.accounts.update({
                    where: {
                        id: source_account_id
                    },
                    data: {
                        balance: {
                            decrement: Number(amount)
                        }
                    }
                })

                if (withdraw.balance < 0) {
                    throw new Error('Insufficient balance');
                }
                
                const result = await tx.transactions.create({
                    select: {
                        id: true,
                        amount: true,
                        date: true,
                        source_account_id: true,
                        transaction_type: {
                            select: {
                                transaction_type_name: true
                            }
                        }
                    },
                    data: {
                        amount: Number(amount),
                        source_account_id,
                        transaction_type_id: Number(transaction_type_id)
                    }
                });
                return result;
            });

            await db.$disconnect();
            res.status(201).json(result);
        } catch (err) {
            console.log(err)
            if (err.isJoi) return res.status(400).send(err.details[0].message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2003') {
                    return res.status(400).json(`The ${err.meta.field_name == 'Transactions_transaction_type_id_fkey (index)' ? 'transaction_type_id' : 'source_account_id'} doesn't exists in other table.`);
                }
            }
            res.status(500).json(err.message)
        }
    }

    async function getOne(req, res) {
        const result = await db.transactions.findFirst({
            select: {
                id: true,
                amount: true,
                date: true,
                source_account_id: true,
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
                    transaction_type_name: "withdraw"
                }
            }
        });
        await db.$disconnect();
        res.status(200).json(result);
    }

    return { get, post, getOne };
}

module.exports = main