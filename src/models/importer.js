const event = require('./dirwatcher').dirWatcherEvent;
const fs = require('fs');

class Importer {
  constructor(searchFolder) {
    event.once('dirwatcher:changed', (path, watcher) => {
      console.log(`changed ${Date.now()} - ${path}   `);

      if (path) {
        this.importMethod(`${searchFolder}/${path.split('___')[0]}`)
          .then(t => console.log(t))
          .catch(e => console.error(e));
      }
    });
  }

  importMethod(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (e, t) => {
        if (e) {
          return reject(e);
        }

        resolve(t.toString());
      });
    });
  }

  importSync(path) {
    return fs.readFileSync(path).toString();
  }
}

module.exports = Importer;
