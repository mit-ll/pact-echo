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