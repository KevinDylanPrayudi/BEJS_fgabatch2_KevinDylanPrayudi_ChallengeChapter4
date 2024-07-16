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

module.exports = {
    identityTypes: identityTypes(),
    users: users()
}