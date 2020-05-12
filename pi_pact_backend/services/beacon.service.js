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

const bleno = require('bleno');

module.exports = {
    name: "beacon",

    settings: {
        uuid: null,
        major: 05,
        minor: 51,
        measuredPower: -59, // -128 - 127
        running: false,
        blenoState: null
    },

    dependencies: [
        "system-state"
    ],

    async started() {
        const stateInfo = await this.broker.call('system-state.state');
        const systemId = stateInfo.system.serial;
        this.settings.uuid = `${systemId}${systemId}`;

        bleno.on('stateChange', (state) => {
            this.settings.blenoState = state;
        })
    },

    actions: {
        status: {
            async handler() {
                return this.getStatus();
            }
        },

        startBeacon: {
            async handler() {
                
                if (this.settings.blenoState==='poweredOn') {
                    bleno.startAdvertisingIBeacon(this.settings.uuid,
                        this.settings.major, 
                        this.settings.minor, 
                        this.settings.measuredPower, (error) => {
                            console.log(`Error starting advertising ${error}`);
                        })
                    this.settings.running = true;
                }
                return this.getStatus();
            }
        },

        stopBeacon: {
            async handler() {
                bleno.stopAdvertising();
                this.settings.running = false;
                return this.getStatus();
            }
        }


    },

    methods: {
        getStatus() {
            return {
                'running': this.settings.running,
                'uuid': this.settings.uuid,
                'major': this.settings.major,
                'minor': this.settings.minor,
                'measuredPower': this.settings.measuredPower,
                'blenoState': this.settings.blenoState
            }
        }
    }
}