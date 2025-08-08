const shell = require('shelljs');

shell.rm('-rf', 'node_modules');
shell.rm('-rf', 'pnpm-lock.yaml');

shell.cd('tailwindconfig');
shell.rm('-rf', 'node_modules');

shell.cd('../auth');
shell.rm('-rf', 'node_modules');

shell.cd('../mocks');
shell.rm('-rf', 'node_modules')

shell.cd('../docs');
shell.rm('-rf', 'node_modules');

shell.cd('../assets');
shell.rm('-rf', 'node_modules');

shell.cd('../core/api');
shell.rm('-rf', 'node_modules');

shell.cd('../main');
shell.rm('-rf', 'node_modules');

shell.cd('../tools');
shell.rm('-rf', 'node_modules');

shell.cd('../../components/vue3');
shell.rm('-rf', 'node_modules');

shell.cd('../../apps/login');
shell.rm('-rf', 'dist');
shell.rm('-rf', 'node_modules');

shell.cd('../../apps/main');
shell.rm('-rf', 'dist');
shell.rm('-rf', 'node_modules');

shell.cd('../../apps/rent');
shell.rm('-rf', 'dist');
shell.rm('-rf', 'node_modules');

shell.cd('../../.husky');
shell.rm('-rf', '_');

shell.cd('../');

console.log('clean success');
