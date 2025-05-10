const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create client build
console.log('Building client...');
exec('cd client && npm run build', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error building client: ${err}`);
    return;
  }
  console.log('Client build complete.');
  console.log(stdout);
  
  // Create server build
  console.log('Building server...');
  exec('tsc -p tsconfig.server.json', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error building server: ${err}`);
      return;
    }
    console.log('Server build complete.');
    console.log(stdout);
    
    console.log('Build process completed successfully!');
  });
});