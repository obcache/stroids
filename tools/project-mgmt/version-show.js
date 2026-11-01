#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function readJsonVersion(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')).version || null;
  } catch {
    return null;
  }
}

function readTextVersion(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim() || null;
  } catch {
    return null;
  }
}

const rows = [];
['package.json', 'package-lock.json', 'VERSION', 'installer/stroids.iss'].forEach(target => {
  const filePath = path.join(root, target);
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const base = path.basename(filePath).toLowerCase();
  let version = null;
  if (base === 'package.json') version = readJsonVersion(filePath);
  else if (base === 'package-lock.json') version = readJsonVersion(filePath);
  else if (base === 'version' || base === 'version.txt') version = readTextVersion(filePath);
  else if (base.endsWith('.iss')) {
    try { version = fs.readFileSync(filePath, 'utf8').match(/#define\s+MyAppVersion\s+"([^"]+)"/)?.[1] || null; } catch {}
  }
  if (version) rows.push({ rel, version });
});

if (!rows.length) {
  console.log('No version files found.');
} else {
  rows.forEach(row => console.log(`${row.rel}: ${row.version}`));
}
