import readDirStream from './readDirStream';

const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');
const util = require('util');
const through = require('through2');

const ROOT = path.join(__dirname, '../../');

const readDir = util.promisify(fs.readdir);

const findOnlyCss = array => (array ? array.filter(el => el.slice(-4) === '.css') : []);

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

  async getCssFilesInsideRepository(folder) {
    let files;
    try {
      files = await readDir(folder);
    } catch (e) {
      console.log(e);
    }

    const fileCss = findOnlyCss(files);
    let childrenCss = [];

    files.filter(el => el.slice(-4) !== '.css').forEach(async el => {
      const nextPath = path.join(folder, el);
      const childrenFiles = await this.getCssFilesInsideRepository(nextPath);
      childrenCss = findOnlyCss(childrenFiles);
    });

    console.log('test', childrenCss);

    return fileCss.concat(childrenCss);
  }

  // async cssBuilder(folder) {
  //   if (!folder) {
  //     throw 'There is no path to readStream';
  //   }
  //
  //   const chosenPath = path.join(ROOT, folder);
  //   const files = await this.getCssFilesInsideRepository(chosenPath);
  //
  //   console.log('result', files)
  // }

  cssBuilder(folder) {
    if (!folder) {
      throw 'There is no path to readStream';
    }

    const chosenPath = path.join(ROOT, folder);
    const files = this.getCssFilesInsideRepository(chosenPath);

    console.log('result', files);
  }

  // async cssBuilder(folder) {
  //   if (!folder) {
  //     throw 'There is no path to readStream';
  //   }
  //
  //   const chosenPath = path.join(ROOT, folder);
  //
  //
  //   console.log(files)
  //
  //   // fs.readdir(chosenPath)
  //   //   .then(files => console.log(files))
  //   //   .catch(er => console.error(er))
  //
  //   // fs.createReadStream(chosenPath)
  //   //   .pipe(through(function(chunk, enc, next) {
  //   //     this.push(chunk);
  //   //
  //   //     next()
  //   //   }))
  //   //   .pipe(process.stdout)
  // }
}

export default Streams;

console.log(argv);
