"use strict";
const noble = require('noble');
const uuid = require('uuid');

module.exports = {
    name: "scanner",
    
    settings: {
        running: false,
        counter: 0,
        lastRxTime: null
    },
    created() {
        noble.on('discover', (peripheral) => {
            // console.log('DISCOVER %s', peripheral.address);
            this.broker.broadcast("advertisment.received", {
                uuid: uuid.v4(),
                id: peripheral.id,
                address: peripheral.address,
                addressType: peripheral.addressType,
                connectable: peripheral.connectable,
                advertisement: peripheral.advertisement,
                rssi: peripheral.rssi
            });
            this.settings.counter = this.settings.counter + 1;
            const date = new Date();
            this.settings.lastRxTime = date.getTime(); 
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
                return { 'running': this.settings.running, 'device': noble.state, 'counter': this.settings.counter, 'lastRxTime': this.settings.lastRxTime };
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