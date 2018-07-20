import { argv } from 'yargs';
import path from 'path';
import fs from 'fs';
import through from 'through2';

import ComposeCss from './composeCss';
const ROOT = path.join(__dirname, '../../');

class Streams {
  constructor() {
    const { action, file, folder } = argv;

    if (!action) {
      throw 'pass action parameter';
    } else if (!this[action]) {
      throw 'Action not found';
    }

    this[action](file || folder);
  }

  readStream(file) {
    if (!file) {
      throw 'There is no file to readStream';
    }

    const chosenFile = path.join(ROOT, file);

    fs.createReadStream(chosenFile).pipe(process.stdout);
  }

  convertToUpperCase() {
    process.stdin
      .pipe(
        through(function(chunk, enc, next) {
          this.push(chunk.toString().toUpperCase());
          next();
        }),
      )
      .pipe(process.stdout);
  }

  // ADD write flag for this action to write file down
  convertCsvToJson(file) {
    if (!file) {
      throw 'There is no file to readStream';
    }
    const chosenFile = path.join(ROOT, file);

    fs.createReadStream(chosenFile)
      .pipe(
        through(function(chunk, enc, next) {
          const chunkString = chunk.toString().split('\n');
          const keys = chunkString
            .splice(0, 1)[0]
            .trim()
            .split(',');

          const result = chunkString.reduce((total, item) => {
            if (!item.length) {
              return total;
            }
            const obj = {};
            let keyIndex = 0;

            item
              .trim()
              .split('"')
              .forEach((string, index) => {
                if (index % 2 === 0) {
                  string.split(',').forEach(el => {
                    if (!el.length) {
                      return;
                    }
                    obj[keys[keyIndex]] = el.trim();
                    keyIndex++;
                  });
                } else {
                  if (!string.length) {
                    return;
                  }
                  obj[keys[keyIndex]] = string.trim();
                  keyIndex++;
                }
              });

            return total.concat([obj]);
          }, []);

          this.push(JSON.stringify(result));

          next();
        }),
      )
      .pipe(
        argv.write ? fs.createWriteStream(chosenFile.replace('.csv', '.json')) : process.stdout,
      );
  }

  cssBuilder(folder) {
    if (!folder) {
      throw 'There is no path to readStream';
    }

    const chosenPath = path.join(ROOT, folder);
    new ComposeCss(chosenPath);
  }
}

export default Streams;
