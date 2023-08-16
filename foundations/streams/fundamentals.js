import { Readable, Writable, Transform } from "node:stream";
// Netflix ?
process.stdin.pipe(process.stdout);

class MultiplyByTenStream extends Writable {
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new OneToHundred()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());
