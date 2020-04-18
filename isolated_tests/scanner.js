var noble = require('noble');

noble.on('discover', (peripheral) => {
    console.log("Disover: %s", peripheral);
})


noble.startScanning([], true);