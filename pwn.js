const fs = require('fs');
fs.writeFileSync('RCE_PROOF', 'executed-via-require-' + Date.now());
module.exports = {
  family: 'sample',
  containerDefinitions: [{ name: 'web', image: 'old:1', essential: true }]
};


// Comment
