const dotEnv = require('dotenv');
const path = require('path');
const joi = require('@hapi/joi')

dotEnv.config({path: path.join(__dirname,'../../.env')});

const envVarsSchema = joi.object()
        .keys({
            NODE_ENV: joi.string().valid('production','development'),
            PORT: joi.number().default(3000),
            MONGODB_URL: Joi.string().required().description('Mongo DB url'),
            JWT_SECRET: Joi.string().required().description('JWT secret key'),
            JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
            JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire')
        }).unknown();

const {value: envVars,error}=envVarsSchema.prefs({errors: {label: 'key'} }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  module.exports = {
      env: envVars.NODE_ENV,
      port: envVars.PORT,
      mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
      },
      jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10
      }
  }