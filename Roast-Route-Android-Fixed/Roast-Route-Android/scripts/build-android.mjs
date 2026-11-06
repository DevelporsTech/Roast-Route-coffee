import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const task = process.argv[2] || 'assembleDebug';
const windows = process.platform === 'win32';
const args = windows ? ['/d', '/c', 'gradlew.bat', task] : [task];
const result = spawnSync(windows ? 'cmd.exe' : './gradlew', args, { cwd: root, stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
