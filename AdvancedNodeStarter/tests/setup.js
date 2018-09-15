jest.setTimeout(30000)
require('../models/User')
const mngs = require('mongoose')
const keys = require('../config/keys')

mngs.Promise = global.Promise;
mngs.connect(keys.mongoURI, {useMongoClient: true});