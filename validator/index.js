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
            password: Joi.string().required()
        })
    }

    function put() {
        return Joi.object({
            name: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string()
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
          
function profiles() {
    function post() {
        return Joi.object({
            user_id: Joi.string().required(),
            identity_type_id: Joi.number().required(),
            identity_number: Joi.string().required(),
            address: Joi.string().required()
        })
    }

    function put() {
        return Joi.object({
            user_id: Joi.string(),
            identity_type_id: Joi.number(),
            identity_number: Joi.string(),
            address: Joi.string()
        })
    }

    return { post, put };
}

module.exports = {
    identityTypes: identityTypes(),
    users: users(),
    accounts: accounts(),
    profiles: profiles()
}