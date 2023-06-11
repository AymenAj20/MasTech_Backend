const joi = require('joi')

exports.registerValidation = function (body) {
  const userValidationSchema = joi.object(
    {
      nom : joi.string().min(2).max(30).trim().required(),
      prenom : joi.string().min(2).max(30).trim().required(),
      email : joi.string().email().trim().required(),
      password : joi.string().min(5).max(30).trim().required()
    }
  )
  return userValidationSchema.validate(body)
}

exports.loginValidation = function (body) {
  const userValidationSchema = joi.object(
    {
      cin : joi.string().trim().required(),
      password : joi.string().min(5).max(30).trim().required()
    }
  )
  return userValidationSchema.validate(body)
}