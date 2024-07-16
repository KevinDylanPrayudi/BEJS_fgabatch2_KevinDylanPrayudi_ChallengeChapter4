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

module.exports = {
    identityTypes: identityTypes()
}