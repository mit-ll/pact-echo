const util = require('util');
const exec = util.promisify(require('child_process').exec);

const f = async () => {
    const { stdout, stderr } = await exec("rfkill unblock wlan");

    if (stdout) {
        console.log("STDOUT: %s", stdout);
        const t = JSON.parse(stdout);
        console.log("T: %s", t['']);
        const responseArray = t[''];
        for (var i = 0; i < responseArray.length; i++) {
            console.log('Output: %s', responseArray[i]);
        }
    }

    if (stderr) {
        console.error(stderr);
    }

}

f();