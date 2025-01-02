const { execSync } = require('child_process');

try {
  // Windows
  if (process.platform === 'win32') {
    execSync('taskkill /F /IM toursync.exe', { stdio: 'ignore' });
  }
  // Mac/Linux
  else {
    execSync('pkill -f toursync', { stdio: 'ignore' });
  }
} catch (e) {
  // Process not found, which is fine
} 