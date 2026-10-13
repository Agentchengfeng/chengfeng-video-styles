#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const HOME = process.env.CHENGFENG_VIDEO_STYLES_HOME || os.homedir();
const PKG_ROOT = path.resolve(__dirname, '..');
const PKG_SKILLS = path.join(PKG_ROOT, 'skills');
const CLAUDE_SKILLS = path.join(HOME, '.claude', 'skills');
const CODEX_SKILLS = path.join(HOME, '.codex', 'skills');
const SKILLS = ['chengfeng-video-styles'];

const log = (s = '') => process.stdout.write(s + '\n');

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isSymbolicLink()) {
      try { fs.rmSync(d, { force: true, recursive: true }); } catch (_) {}
      fs.symlinkSync(fs.readlinkSync(s), d);
    } else {
      fs.copyFileSync(s, d);
      try { fs.chmodSync(d, fs.statSync(s).mode); } catch (_) {}
    }
  }
}

function backupAndRemove(target, label) {
  if (!fs.existsSync(target)) return null;
  const backupDir = path.join(CLAUDE_SKILLS, '.backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backup = path.join(backupDir, `${label}-${timestamp()}`);
  copyDir(target, backup);
  fs.rmSync(target, { recursive: true, force: true });
  return backup;
}

function installSkill(name) {
  const src = path.join(PKG_SKILLS, name);
  const dst = path.join(CLAUDE_SKILLS, name);
  if (!fs.existsSync(src)) throw new Error(`Missing packaged skill: ${src}`);
  const backup = fs.existsSync(dst) ? backupAndRemove(dst, name) : null;
  copyDir(src, dst);
  for (const file of ['LICENSE', 'NOTICE.md', 'CITATION.cff']) {
    const packaged = path.join(PKG_ROOT, file);
    if (fs.existsSync(packaged)) fs.copyFileSync(packaged, path.join(dst, file));
  }
  log(`  ✓ ${name} -> ${dst}`);
  if (backup) log(`    backup: ${backup}`);
}

function linkCodexSkill(name) {
  fs.mkdirSync(CODEX_SKILLS, { recursive: true });
  const target = path.join(CLAUDE_SKILLS, name);
  const link = path.join(CODEX_SKILLS, name);
  if (fs.existsSync(link) || isDanglingLink(link)) {
    if (fs.lstatSync(link).isSymbolicLink()) {
      fs.unlinkSync(link);
    } else {
      const backup = backupAndRemove(link, `${name}-codex`);
      if (backup) log(`    Codex backup: ${backup}`);
    }
  }
  fs.symlinkSync(target, link);
  log(`  ✓ ${name} linked -> ${link}`);
}

function isDanglingLink(p) {
  try { return fs.lstatSync(p).isSymbolicLink(); } catch (_) { return false; }
}

function doctor() {
  let ok = true;
  for (const name of SKILLS) {
    const claude = path.join(CLAUDE_SKILLS, name, 'SKILL.md');
    const notice = path.join(CLAUDE_SKILLS, name, 'NOTICE.md');
    const codex = path.join(CODEX_SKILLS, name);
    const exists = fs.existsSync(claude);
    const hasNotice = fs.existsSync(notice);
    const linked = fs.existsSync(codex) && fs.lstatSync(codex).isSymbolicLink();
    log(`${exists ? '✓' : '✗'} Claude skill: ${claude}`);
    log(`${hasNotice ? '✓' : '✗'} Attribution notice: ${notice}`);
    log(`${linked ? '✓' : '✗'} Codex symlink: ${codex}`);
    ok = ok && exists && hasNotice && linked;
  }
  process.exit(ok ? 0 : 1);
}

function uninstall() {
  for (const name of SKILLS) {
    const claude = path.join(CLAUDE_SKILLS, name);
    const codex = path.join(CODEX_SKILLS, name);
    if (isDanglingLink(codex) || fs.existsSync(codex)) fs.rmSync(codex, { recursive: true, force: true });
    if (fs.existsSync(claude)) {
      const backup = backupAndRemove(claude, `${name}-removed`);
      log(`  ✓ removed ${name}; backup: ${backup}`);
    }
  }
}

function help() {
  log('chengfeng-video-styles');
  log('');
  log('Usage:');
  log('  npx -y github:Agentchengfeng/chengfeng-video-styles install');
  log('  npx -y github:Agentchengfeng/chengfeng-video-styles cpm install');
  log('  chengfeng-video-styles install');
  log('  chengfeng-video-styles-cpm install');
  log('');
  log('Commands: install, doctor, uninstall, help');
  log('For tests only: set CHENGFENG_VIDEO_STYLES_HOME=/tmp/some-home.');
}

function main() {
  let args = process.argv.slice(2);
  if (args[0] === 'cpm') args = args.slice(1);
  const cmd = args[0] || 'install';
  if (cmd === 'help' || cmd === '--help' || cmd === '-h') return help();
  if (cmd === 'doctor') return doctor();
  if (cmd === 'uninstall') return uninstall();
  if (cmd !== 'install') {
    log(`Unknown command: ${cmd}`);
    help();
    process.exit(1);
  }
  log('▶ Installing chengfeng-video-styles');
  fs.mkdirSync(CLAUDE_SKILLS, { recursive: true });
  for (const name of SKILLS) installSkill(name);
  for (const name of SKILLS) linkCodexSkill(name);
  log('');
  log('Done. Open a new Claude Code / Codex session so the skill list reloads.');
}

main();
