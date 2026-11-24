import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const composePath = path.resolve('docker-compose.yml');

if (!fs.existsSync(composePath)) {
  console.error(`FAIL: docker-compose.yml not found at ${composePath}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(composePath, 'utf8');
let parsed;

try {
  parsed = YAML.parse(fileContent);
  console.log('✓ docker-compose.yml is valid YAML');
} catch (err) {
  console.error('FAIL: Failed to parse docker-compose.yml as YAML:', err);
  process.exit(1);
}

const requiredServices = ['mongo', 'mongo-init', 'redis', 'n8n'];
const services = parsed.services || {};

for (const service of requiredServices) {
  if (!services[service]) {
    console.error(`FAIL: Required service '${service}' is missing from docker-compose.yml`);
    process.exit(1);
  }
  console.log(`✓ Service '${service}' is defined`);
}

// Verify MongoDB Replica Set configuration
const mongoCommand = services.mongo.command || [];
if (!mongoCommand.includes('rs0') && !JSON.stringify(mongoCommand).includes('rs0')) {
  console.error('FAIL: MongoDB service does not configure replica set rs0');
  process.exit(1);
}
console.log("✓ MongoDB configured with replica set 'rs0'");

// Verify Redis configuration
const redisVolumes = services.redis.volumes || [];
const hasRedisConf = redisVolumes.some((v) => v.includes('redis.conf'));
if (!hasRedisConf) {
  console.error('FAIL: Redis service does not mount custom redis.conf');
  process.exit(1);
}
console.log('✓ Redis configured with custom redis.conf');

// Verify n8n Webhook configuration
const n8nEnv = services.n8n.environment || [];
const hasWebhookUrl = Array.isArray(n8nEnv)
  ? n8nEnv.some((e) => e.startsWith('WEBHOOK_URL='))
  : Boolean(n8nEnv.WEBHOOK_URL);
if (!hasWebhookUrl) {
  console.error('FAIL: n8n service missing WEBHOOK_URL environment variable');
  process.exit(1);
}
console.log('✓ n8n configured with WEBHOOK_URL');

// Verify Volumes
const requiredVolumes = ['mongo_data', 'redis_data', 'n8n_data'];
const volumes = parsed.volumes || {};
for (const vol of requiredVolumes) {
  if (!volumes[vol]) {
    console.error(`FAIL: Required volume '${vol}' is missing`);
    process.exit(1);
  }
  console.log(`✓ Volume '${vol}' is defined`);
}

// Verify Network
if (!parsed.networks || !parsed.networks['yt-network']) {
  console.error("FAIL: Required network 'yt-network' is missing");
  process.exit(1);
}
console.log("✓ Network 'yt-network' is defined");

console.log('\nAll Docker Compose infrastructure validations passed successfully!');
