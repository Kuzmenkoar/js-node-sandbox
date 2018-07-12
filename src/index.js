const config = require('../config/env.config.json');
const User = require('./models/user');
const Product = require('./models/product');

console.log('name', config.name);
const user = new User();
const product = new Product();
