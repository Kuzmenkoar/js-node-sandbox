import path from 'path';
import Streams from './utils/streams';

const root = path.join(__dirname, '../');

// first homework

// const config = require('../config/env.config.json');
// const User = require('./models/user');
// const Product = require('./models/product');
//
// console.log('name', config.name);
// new User();
// new Product();

// second homework

// const searchFolder = path.join(root, './data');
// const Dirwatcher = require('./models/dirwatcher').default;
// const Importer = require('./models/importer');
// new Importer(searchFolder);
//
// const watcher = new Dirwatcher();
//
// watcher.watch(searchFolder);

// third lesson

new Streams();
