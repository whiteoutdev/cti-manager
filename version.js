const exec        = require('child_process').exec,
      path        = require('path'),
      packageJson = require('./package.json'),
      newVersion  = packageJson.version;

Promise.all([
    new Promise((resolve, reject) => {
        exec(`npm version ${newVersion}`, {cwd: path.join(__dirname, 'cti-manager-server')}, (err, stdout, stderr) => {
            console.log(stdout);
            console.error(stderr);

            if (err) {
                reject(err);
            }

            resolve();
        });
    }),
    new Promise((resolve, reject) => {
        exec(`npm version ${newVersion}`, {cwd: path.join(__dirname, 'cti-manager-web-ui')}, (err, stdout, stderr) => {
            console.log(stdout);
            console.error(stderr);

            if (err) {
                reject(err);
            }

            resolve();
        });
    })
]).then(() => {
    exec('git add -A', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
    });
}, () => {
    console.log('Version failed');
});
