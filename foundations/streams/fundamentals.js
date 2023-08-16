import { Readable } from "node:stream";
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

new OneToHundred().pipe(process.stdout);
