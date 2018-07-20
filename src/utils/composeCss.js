// import { Readable } from 'stream';
import through from 'through2';
import fs from 'fs';
import util from 'util';
import path from 'path';
import EventEmitter from 'events';

const event = new EventEmitter();
const readDir = util.promisify(fs.readdir);
const findOnlyCss = array => (array ? array.filter(el => el.slice(-4) === '.css') : []);
const outputPath = path.join(__dirname, './output.css');

let isFirstSave = true;
event.on('compose', el => {
  const writeFinalCss = fs.createWriteStream(outputPath, { flags: isFirstSave ? 'w' : 'a' });
  isFirstSave = false;

  fs.createReadStream(el)
    .on('error', e => console.log(e))
    .pipe(writeFinalCss)
    .on('error', e => console.log(e));
});

class ComposeCss {
  constructor(folder) {
    this.getCssFilesInsideRepository(folder);
  }

  async getCssFilesInsideRepository(folder) {
    let files;
    try {
      files = await readDir(folder);
    } catch (error) {
      console.log(error);
    }

    findOnlyCss(files)
      .map(el => `${folder}/${el}`)
      .forEach(el => {
        event.emit('compose', el);
      });

    files.filter(el => el.slice(-4) !== '.css').forEach(async el => {
      const nextPath = path.join(folder, el);
      await this.getCssFilesInsideRepository(nextPath);
    });
  }
}

export default ComposeCss;
