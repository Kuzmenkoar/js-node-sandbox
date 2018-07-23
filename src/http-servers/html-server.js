import http from 'http';
import fs from 'fs';
import path from 'path';
import through from 'through2';

const htmlFile = path.join(__dirname, './index.html');

const readStream = fs.createReadStream(htmlFile);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  // Sync way
  // const file = fs.readFileSync(htmlFile, { encoding: 'utf-8' }).replace('{message}', 'My message: Hello world')
  // res.end(file);

  // Right way

  readStream
    .pipe(
      through(function(chunk, enc, next) {
        this.push(chunk.toString().replace('{message}', 'My message: Hello world'));
        next();
      }),
    )
    .pipe(res);
  readStream.on('end', () => {
    res.end();
  });
});

export default function() {
  server.listen(3000);
}
