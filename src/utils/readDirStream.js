import { Readable } from 'stream';
import fs from 'fs';
import util from 'util';

const readDir = util.promisify(fs.readdir);

class readDirStream extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max) this.push(null);
    else {
      const str = '' + i;
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}

export default readDirStream;
