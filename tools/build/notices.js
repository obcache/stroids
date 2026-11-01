const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const packages = [
  'react',
  'react-dom',
  'scheduler',
  'lucide-react',
  '@fontsource/space-grotesk',
  '@fontsource/ibm-plex-mono',
  '@fontsource/orbitron',
];
const notices = [
  'STROIDS — third-party runtime notices\n\nElectron and Chromium notices are also included beside STROIDS.exe.\n',
];
for (const name of packages) {
  const directory = path.join(root, 'node_modules', name);
  const metadata = JSON.parse(
    fs.readFileSync(path.join(directory, 'package.json'), 'utf8'),
  );
  notices.push(
    `\n${'='.repeat(72)}\n${name} ${metadata.version}\n${'='.repeat(72)}\n\n${fs.readFileSync(path.join(directory, 'LICENSE'), 'utf8')}`,
  );
}
fs.writeFileSync(
  path.join(root, 'public/THIRD_PARTY_NOTICES.txt'),
  notices.join('\n'),
);
console.log('Third-party runtime and font notices assembled.');
