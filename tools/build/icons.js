const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  const root = path.resolve(__dirname, '../..'),
    source = path.join(root, 'public/icon.svg');
  const sizes = [16, 32, 48, 64, 128, 256],
    images = await Promise.all(
      sizes.map((size) => sharp(source).resize(size, size).png().toBuffer()),
    );
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    header[entry] = size === 256 ? 0 : size;
    header[entry + 1] = size === 256 ? 0 : size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[index].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  });
  fs.writeFileSync(
    path.join(root, 'public/icon.ico'),
    Buffer.concat([header, ...images]),
  );
  fs.writeFileSync(path.join(root, 'public/icon.png'), images.at(-1));
  console.log('Application and launcher icons generated (16–256 px).');
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
