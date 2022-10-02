const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().required().description('Port number'),
    MONGO_USERNAME: Joi.string().required().description('MongoDB Username required'),
    MONGO_PASSWORD: Joi.string().required().description('MongoDB Password required'),
    EMAIL_HOST: Joi.string().required().description('Email host required'),
    EMAIL_PORT: Joi.number().required().description('Email port required'),
    EMAIL: Joi.string().required().description('Email required'),
    EMAIL_PASSWORD: Joi.string().required().description('Email password required'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  mongoose: {
    // Check environment variable for mongoose connection URI
    uri: `mongodb+srv://${envVars.MONGO_USERNAME}:${envVars.MONGO_PASSWORD}@cluster0.crcha4h.mongodb.net/antoanungdungweb?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  smtp: {
    email: envVars.EMAIL,
    password: envVars.EMAIL_PASSWORD,
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
  },
};
