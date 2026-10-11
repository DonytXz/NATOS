import { copyFile } from 'node:fs/promises';
await copyFile('dist/proyecto/browser/index.html', 'dist/proyecto/browser/404.html');
