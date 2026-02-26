#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const minLines = Number(process.env.COVERAGE_MIN_LINES || 80);
const minFuncs = Number(process.env.COVERAGE_MIN_FUNCS || 75);
const coverageDir = process.env.COVERAGE_DIR || '/tmp/tomorrowdao-skill-coverage';
const lcovPath = path.join(coverageDir, 'lcov.info');

const cmd = process.platform === 'win32' ? 'bun.cmd' : 'bun';
const args = [
  'test',
  '--coverage',
  '--coverage-reporter=lcov',
  `--coverage-dir=${coverageDir}`,
  'tests/unit/',
  'tests/integration/',
  'tests/e2e/',
];

const result = spawnSync(cmd, args, {
  encoding: 'utf-8',
  env: process.env,
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';
process.stdout.write(stdout);
process.stderr.write(stderr);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (!fs.existsSync(lcovPath)) {
  console.error(`Coverage gate failed: ${lcovPath} not found.`);
  process.exit(1);
}

const text = fs.readFileSync(lcovPath, 'utf-8');
const sections = text.split('end_of_record\n');

let lf = 0;
let lh = 0;
let fnf = 0;
let fnh = 0;

for (const section of sections) {
  const sfMatch = section.match(/^SF:(.+)$/m);
  if (!sfMatch) continue;
  const sourceFile = sfMatch[1].trim();

  // Gate only on production source files.
  if (!sourceFile.startsWith('src/')) continue;

  const lfMatch = section.match(/^LF:(\d+)$/m);
  const lhMatch = section.match(/^LH:(\d+)$/m);
  const fnfMatch = section.match(/^FNF:(\d+)$/m);
  const fnhMatch = section.match(/^FNH:(\d+)$/m);

  lf += Number(lfMatch?.[1] || 0);
  lh += Number(lhMatch?.[1] || 0);
  fnf += Number(fnfMatch?.[1] || 0);
  fnh += Number(fnhMatch?.[1] || 0);
}

if (lf === 0 || fnf === 0) {
  console.error('Coverage gate failed: no src/** coverage data found in lcov report.');
  process.exit(1);
}

const linePct = (lh / lf) * 100;
const funcPct = (fnh / fnf) * 100;

const failures: string[] = [];
if (linePct < minLines) failures.push(`lines ${linePct.toFixed(2)}% < ${minLines}%`);
if (funcPct < minFuncs) failures.push(`funcs ${funcPct.toFixed(2)}% < ${minFuncs}%`);

if (failures.length > 0) {
  console.error(`Coverage gate failed: ${failures.join(', ')}`);
  process.exit(1);
}

console.log(
  `Coverage gate passed (src-only): funcs=${funcPct.toFixed(2)}%, lines=${linePct.toFixed(2)}%. thresholds: funcs>=${minFuncs} lines>=${minLines}`,
);
