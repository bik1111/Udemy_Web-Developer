
const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => {

    return {

        type: 'string',
        base: joi.string(),
        rules: {
            escapeHTML: {
                validate(value, helpers) {

                    const clean =  sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if (clean !== value) return helpers.error('string.escapeHTML', { value })
                    return clean;
                },
            },
        },
    };
};

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    //campground 가 key 모두 campground 아래로 전송되야함.
    // object는 type을 의미(campground객체), required는 반드시 제출되야함을 의미.
    campground: Joi.object({
        title : Joi.string().required().escapeHTML(),
        price : Joi.number().required().min(0),
        //img : Joi.string().required(),
        location : Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()

})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body : Joi.string().required().escapeHTML()
    }).required()

})

