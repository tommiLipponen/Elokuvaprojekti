const fs = require('fs');
const path = require('path');
const swaggerSpec = require('../swagger');

const outputPath = path.join(__dirname, '..', 'swagger', 'openapi.json');
fs.writeFileSync(outputPath, `${JSON.stringify(swaggerSpec, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
