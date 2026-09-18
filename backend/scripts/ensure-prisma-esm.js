// prisma generate wipes backend/generated/prisma on every run, so this restores the
// package.json marker that lets Node parse the generated .ts client's ESM `import` syntax
// (see config/prisma.js's dynamic import of client.ts). Run automatically after `prisma generate`.
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'generated', 'prisma');
const targetFile = path.join(targetDir, 'package.json');

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetFile, `${JSON.stringify({ type: 'module' }, null, 2)}\n`);
console.log(`Wrote ${path.relative(process.cwd(), targetFile)}`);
