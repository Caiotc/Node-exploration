import { Readable, Writable, Transform } from "node:stream";
// Netflix ?
process.stdin.pipe(process.stdout);

class OneToHundred extends Readable {
  index = 1;

  _read() {
    const i = this.index++;
    setTimeout(() => {
      if (i > 150) this.push(null);
      else {
        const buf = Buffer.from(i.toString());
        this.push(buf);
      }
    }, 1000);
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, enconding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed)));
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new OneToHundred()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());
