const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const outPath = path.join(rootDir, 'js', 'env.js');

if (!fs.existsSync(envPath)) {
  console.error('.env file not found. Create it from .env.example first.');
  process.exit(1);
}

const rawEnv = fs.readFileSync(envPath, 'utf8');
const env = {};

rawEnv.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  const separatorIndex = trimmed.indexOf('=');
  if (separatorIndex === -1) return;

  const key = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();
  env[key] = value;
});

const requiredKeys = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'];
const missingKeys = requiredKeys.filter((key) => !env[key]);

if (missingKeys.length > 0) {
  console.error(`Missing required keys in .env: ${missingKeys.join(', ')}`);
  process.exit(1);
}

const output = `window.__ENV__ = {\n  SUPABASE_URL: '${env.SUPABASE_URL}',\n  SUPABASE_PUBLISHABLE_KEY: '${env.SUPABASE_PUBLISHABLE_KEY}'\n};\n`;

fs.writeFileSync(outPath, output, 'utf8');
console.log(`Generated ${path.relative(rootDir, outPath)} from .env`);
