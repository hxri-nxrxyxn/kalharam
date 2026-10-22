import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to get local LAN IPv4 addresses
function getLanIps() {
	const interfaces = os.networkInterfaces();
	const ips = [];
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name] || []) {
			if (iface.family === 'IPv4' && !iface.internal) {
				ips.push(iface.address);
			}
		}
	}
	return ips;
}

const lanIps = getLanIps();
const lanHost = lanIps[0] || 'localhost';

console.log('\x1b[1m\x1b[34m=======================================================');
console.log('   Starting Kalharam Multi-Server Environment');
console.log('=======================================================\x1b[0m\n');
console.log('\x1b[32m  ➜ Web Storefront:\x1b[0m   http://localhost:5173');
if (lanIps.length > 0) {
	console.log(`\x1b[32m    Network (LAN):\x1b[0m   http://${lanHost}:5173`);
}
console.log('\x1b[35m  ➜ Admin App:\x1b[0m        http://localhost:5174');
if (lanIps.length > 0) {
	console.log(`\x1b[35m    Network (LAN):\x1b[0m   http://${lanHost}:5174`);
}
console.log('\x1b[36m  ➜ Backend API:\x1b[0m      http://localhost:3000\n');
console.log('\x1b[90m  Press Ctrl+C to stop all servers cleanly.\x1b[0m\n');
console.log('\x1b[1m\x1b[34m-------------------------------------------------------\x1b[0m\n');

const services = [
	{
		name: 'backend',
		color: '\x1b[36m', // Cyan
		cwd: path.join(rootDir, 'backend'),
		cmd: 'npm',
		args: ['run', 'dev']
	},
	{
		name: 'web    ',
		color: '\x1b[32m', // Green
		cwd: path.join(rootDir, 'web'),
		cmd: 'npm',
		args: ['run', 'dev']
	},
	{
		name: 'app    ',
		color: '\x1b[35m', // Magenta
		cwd: path.join(rootDir, 'app'),
		cmd: 'npm',
		args: ['run', 'dev']
	}
];

const children = [];
let isShuttingDown = false;

function cleanExit() {
	if (isShuttingDown) return;
	isShuttingDown = true;
	console.log('\n\x1b[33mShutting down all development servers...\x1b[0m');
	for (const child of children) {
		try {
			if (child && !child.killed) {
				child.kill('SIGINT');
			}
		} catch (err) {}
	}
	setTimeout(() => {
		for (const child of children) {
			try {
				if (child && !child.killed) {
					child.kill('SIGKILL');
				}
			} catch (err) {}
		}
		process.exit(0);
	}, 1500);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);

for (const svc of services) {
	const child = spawn(svc.cmd, svc.args, {
		cwd: svc.cwd,
		stdio: ['inherit', 'pipe', 'pipe'],
		shell: true,
		env: { ...process.env, FORCE_COLOR: '1' }
	});

	children.push(child);

	const prefix = `${svc.color}[${svc.name}]\x1b[0m `;

	let stdoutBuf = '';
	child.stdout.on('data', (data) => {
		stdoutBuf += data.toString();
		const lines = stdoutBuf.split('\n');
		stdoutBuf = lines.pop(); // keep partial line in buffer
		for (const line of lines) {
			process.stdout.write(`${prefix}${line}\n`);
		}
	});

	let stderrBuf = '';
	child.stderr.on('data', (data) => {
		stderrBuf += data.toString();
		const lines = stderrBuf.split('\n');
		stderrBuf = lines.pop();
		for (const line of lines) {
			process.stderr.write(`${prefix}${line}\n`);
		}
	});

	child.on('close', (code) => {
		if (stdoutBuf) process.stdout.write(`${prefix}${stdoutBuf}\n`);
		if (stderrBuf) process.stderr.write(`${prefix}${stderrBuf}\n`);
		if (!isShuttingDown && code !== 0 && code !== null) {
			console.log(`\x1b[31m[${svc.name}] process exited with code ${code}\x1b[0m`);
		}
	});
}
