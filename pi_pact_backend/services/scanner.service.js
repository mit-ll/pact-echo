/* 
 *  DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.
 *  
 *  This material is based upon work supported by the United States Air Force under
 *   Air Force Contract No. FA8702-15-D-0001. Any opinions, findings, conclusions 
 *   or recommendations expressed in this material are those of the author(s) and 
 *   do not necessarily reflect the views of the United States Air Force.
 *  
 *  (c) 2020 Massachusetts Institute of Technology.
 *  
 *  The software/firmware is provided to you on an As-Is basis
 *  
 *  Delivered to the U.S. Government with Unlimited Rights, as defined in 
 *  DFARS Part 252.227-7013 or 7014 (Feb 2014). Notwithstanding any copyright
 *  notice, U.S. Government rights in this work are defined by DFARS 252.227-7013 
 *  or DFARS 252.227-7014 as detailed above. Use of this work other than as 
 *  specifically authorized by the U.S. Government may violate any copyrights 
 *  that exist in this work.
 */

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

        this.start_scanner();
        this.settings.running = true;
    },

    actions: {
        status: {
            async handler() {
                return this.get_status_message();
            }
        },

        startScanner: {
            async handler() {
                    this.start_scanner();
                    
                    this.settings.running = true;

                    return this.get_status_message();
            }
        },

        stopScanner: {
            async handler() {
                noble.stopScanning();
                this.settings.running = false;
                return this.get_status_message();
            }
        }


    },

    methods: {
        get_status_message() {
            return { 'running': this.settings.running, 'device': noble.state, 'counter': this.settings.counter, 'lastRxTime': this.settings.lastRxTime };
        },

        start_scanner() {
            noble.startScanning([], true); //Start scanning with duplicates
        }
    }
}