"use strict";
const noble = require('noble');


module.exports = {
    name: "scanner",
    
    settings: {
        running: false
    },
    created() {
        noble.on('discover', (peripheral) => {
            console.log('DISCOVER %s', peripheral.address);
            this.broker.broadcast("advertisment.received", {advertisement: peripheral});
        })
        
        noble.on('startScan', () => {
            console.log("STARTING SCAN");
        })
        
        noble.on('stopScan', () => {
            console.log("ENDING SCAN");
        })                
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
                    
                    this.settings.running = true;

                    return { 'running': this.settings.running, 'device': noble.state };
            }
        },

        stopScanner: {
            async handler() {
                noble.stopScanning();
                this.settings.running = false;
                return { 'running': this.settings.running, 'device': noble.state };
            }
        }


    }
}