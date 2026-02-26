#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';

const minLines = Number(process.env.COVERAGE_MIN_LINES || 65);
const minFuncs = Number(process.env.COVERAGE_MIN_FUNCS || 60);

const cmd = process.platform === 'win32' ? 'bun.cmd' : 'bun';
const args = ['test', '--coverage', 'tests/unit/', 'tests/integration/', 'tests/e2e/'];
const result = spawnSync(cmd, args, {
  encoding: 'utf-8',
  env: process.env,
});

const stdout = result.stdout || '';
const stderr = result.stderr || '';
process.stdout.write(stdout);
process.stderr.write(stderr);
const output = `${stdout}\n${stderr}`;

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const allFilesMatch = output.match(/All files\s*\|\s*([0-9.]+)\s*\|\s*([0-9.]+)/);
if (!allFilesMatch) {
  console.error('Coverage gate failed: unable to parse coverage summary for "All files".');
  process.exit(1);
}

const funcs = Number(allFilesMatch[1]);
const lines = Number(allFilesMatch[2]);

const failures: string[] = [];
if (Number.isNaN(lines) || lines < minLines) {
  failures.push(`lines ${lines.toFixed(2)}% < ${minLines}%`);
}
if (Number.isNaN(funcs) || funcs < minFuncs) {
  failures.push(`funcs ${funcs.toFixed(2)}% < ${minFuncs}%`);
}

if (failures.length > 0) {
  console.error(`Coverage gate failed: ${failures.join(', ')}`);
  process.exit(1);
}

console.log(`Coverage gate passed: funcs=${funcs.toFixed(2)}%, lines=${lines.toFixed(2)}%.`);
