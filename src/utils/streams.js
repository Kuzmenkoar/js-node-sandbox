const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');
const through2 = require('through2');

const ROOT = path.join(__dirname, '../../');

class Streams {
  constructor() {
    const { action, file } = argv;

    if (!action) {
      throw 'pass action parameter';
    } else if (!this[action]) {
      throw 'Action not found';
    }

    this[action](file);
  }

  readStream(file) {
    if (!file) {
      console.log('There is no file to readStream');
      return;
    }

    const chosenFile = path.join(ROOT, file);

    fs.createReadStream(chosenFile).pipe(process.stdout);
  }

  convertToUpperCase() {
    process.stdin
      .pipe(
        through2(function(chunk, enc, next) {
          this.push(chunk.toString().toUpperCase());
          next();
        }),
      )
      .pipe(process.stdout);
  }
}

module.exports = Streams;

console.log(argv);
