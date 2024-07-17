const Joi = require('joi');

function identityTypes() {
    function post() {
        return Joi.object({
            identity_type_name: Joi.string().required()
        })
    }
    
    function put() {
        return Joi.object({
            identity_type_name: Joi.string().required()
        })
    }

    return { post, put };
}

function users() {
    function post() {
        return Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),    
            identity_type_id: Joi.number().required(),
            identity_number: Joi.string().required(),
            address: Joi.string().required()
        })
    }

    function put() {
        return Joi.object({
            name: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string(),
            identity_type_id: Joi.number(),
            identity_number: Joi.string(),
            address: Joi.string()
        })
    }

    return { post, put };
}

function accounts() {
    function post() {
        return Joi.object({
            user_id: Joi.string().required(),
            bank_name: Joi.string().required(),
            bank_account_number: Joi.string().required(),
            balance: Joi.number().required()
        })
    }
  
    function put() {
        return Joi.object({
            user_id: Joi.string(),
            bank_name: Joi.string(),
            bank_account_number: Joi.string(),
            balance: Joi.number()
        })
    }
  
  return { post, put };
}

function transactionTypes() {
    function post() {
        return Joi.object({
            transaction_type_name: Joi.string().required()
        })
    }
    
    function put() {
        return Joi.object({
            transaction_type_name: Joi.string()
        })
    }

    return { post, put };
}

function transactions() {
    function deposit() {
        return Joi.object({
            destination_account_id: Joi.string().required(),
            amount: Joi.number().greater(0).required(),
            transaction_type_id: Joi.number().required()
        })
    }

    function withdraw() {
        return Joi.object({
            source_account_id: Joi.string().required(),
            amount: Joi.number().greater(0).required(),
            transaction_type_id: Joi.number().required()
        })
    }

    return { deposit, withdraw };
}

module.exports = {
    identityTypes: identityTypes(),
    users: users(),
    accounts: accounts(),
    transactionTypes: transactionTypes(),
    transactions: transactions()
}