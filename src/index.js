import path from 'path';
import { argv } from 'yargs';

//first
import config from '../config/env.config.json';
import User from './models/user';
import Product from './models/product';
//second
import Dirwatcher from './models/dirwatcher';
import Importer from './models/importer';
//third
import Streams from './utils/streams';
//fourth
import htmlHttpServer from './http-servers/html-server';
import jsonHttpServer from './http-servers/json-server';
import plainHttpServer from './http-servers/plain-text-server';
import runServer from './server/index';

const root = path.join(__dirname, '../');

class Homeworks {
  constructor() {
    const { homework } = argv;

    if (!homework) {
      throw 'pass homework parameter';
    } else if (!this[homework]) {
      throw 'Action not found';
    }

    this[homework]();
  }

  firstHomework() {
    console.log('name', config.name);
    new User();
    new Product();
  }

  secondHomework() {
    const searchFolder = path.join(root, './data');

    new Importer(searchFolder);

    const watcher = new Dirwatcher();

    watcher.watch(searchFolder);
  }

  thirdHomework() {
    new Streams();
  }

  fourthHomework() {
    const { httpServer } = argv;
    if (httpServer) {
      const httpServers = {
        htmlHttpServer,
        plainHttpServer,
        jsonHttpServer,
      };
      httpServers[`${httpServer}HttpServer`]();
    } else {
      runServer();
    }
  }
}

console.log(argv);
new Homeworks();
