"use strict";
const noble = require('noble');

noble.on('discover', (peripheral) => {
    console.log('DISCOVER %s', peripheral.address);
})

noble.on('startScan', () => {
    console.log("STARTING SCAN");
})

noble.on('stopScan', () => {
    console.log("ENDING SCAN");
})

module.exports = {
    name: "scanner",
    
    settings: {
        running: false
    },

    actions: {
        status: {
            async handler() {
                return { 'running': this.settings.running, 'device': noble.state };
            }
        },

        startScanner: {
            async handler() {
                    noble.startScanning([], true); //Start scanning with duplicates
                    
                    this.settings.running = noble.state;

                return { 'running': this.settings.running}
            }
        },

        stopScanner: {
            async handler() {
                noble.stopScanning();
                this.settings.running = noble.state;
            }
        }


    }
}