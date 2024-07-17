const Prisma = require('@prisma/client');

const validator = require('../../../validator');

function main(db) {

    async function sender(req, res) {
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
                    transaction_type_name: "transfer"
                }
            }
        })

        await db.$disconnect();
        res.status(200).json(result);
    }

    async function recepient(req, res) {
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
                    transaction_type_name: "transfer"
                }
            }
        })

        await db.$disconnect();
        res.status(200).json(result);
    }

    async function post(req, res) {
        try {
            await validator.transactions.transfer().validateAsync(req.body)
            const { amount, source_account_id, destination_account_id, transaction_type_id } = req.body;
            const result = await db.$transaction(async (tx) => {
                const transfer = await tx.accounts.update({
                    where: {
                        id: source_account_id
                    },
                    data: {
                        balance: {
                            decrement: Number(amount)
                        }
                    }
                });

                if(transfer.balance < 0) {
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
                        destination_account_id,
                        transaction_type_id: Number(transaction_type_id)
                    }
                })

                await tx.accounts.update({
                    where: {
                        id: destination_account_id
                    },
                    data: {
                        balance: {
                            increment: Number(amount)
                        }
                    }
                })

                return result;
            });

            await db.$disconnect();
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
        const result = await db.transactions.findFirst({
            select: {
                id: true,
                amount: true,
                date: true,
                source_account_id: true,
                destination_account_id: true,
                transaction_type: {
                    select: {
                        transaction_type_name: true
                    }
                }
            },
            where: {
                id: req.params.id
            }
        })

        await db.$disconnect();
        res.status(200).json(result);
    }

    return { sender, recepient, post, getOne }
}

module.exports = main