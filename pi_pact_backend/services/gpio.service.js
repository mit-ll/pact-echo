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

const rpio = require('rpio');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
    name: "gpio",

    settings: {
        red_pin: 26,
        yellow_pin: 20,
        green_pin: 21,
        wifi_pin: 16,
        period_timer: null
    },

    async started() {
        rpio.init({ mapping: 'gpio' });
        rpio.open(this.settings.wifi_pin, rpio.INPUT, rpio.PULL_UP);
        rpio.poll(this.settings.wifi_pin, this.toggle_wifi);
        rpio.open(this.settings.yellow_pin, rpio.OUTPUT, rpio.LOW);
        rpio.open(this.settings.red_pin, rpio.OUTPUT, rpio.LOW);
        rpio.open(this.settings.green_pin, rpio.OUTPUT, rpio.LOW);
        this.settings.period_timer = setInterval(this.pollServices, 10000); //10 second interval
    },

    async stopped() {
        clearInterval(this.settings.period_timer);
        rpio.open(this.settings.yellow_pin, rpio.OUTPUT, rpio.LOW);
        rpio.open(this.settings.red_pin, rpio.OUTPUT, rpio.LOW);
        rpio.open(this.settings.green_pin, rpio.OUTPUT, rpio.LOW);

    },

    dependencies: [
        "system-state",
        "recorder",
        "scanner",
        "beacon"
    ],


    events: {
        "advertisment.received"(ctx) {

        }
    },

    actions: {

    },

    methods: {
        async pollServices() {
            const scanner = await this.broker.call('scanner.status');
            const recorder = await this.broker.call('recorder.status');
            const beacon = await this.broker.call('beacon.status');
            const system_state = await this.broker.call('system-state.state');

            // console.log("Scanner %s\tRecorder %s\tBeacon %s", scanner.running, recorder.running, beacon.running)
            // console.log("Bluetooth: %s", system_state.rf.bluetooth);
            // console.log("WLAN: %s", system_state.rf.wlan);

            if (scanner.running) {
                this.blink_once(this.settings.red_pin, 1000);
            }

            if (recorder.running) {
                this.blink_once(this.settings.yellow_pin, 1000);
            }

            if (beacon.running) {
                this.blink_once(this.settings.green_pin, 1000);
            }

            if (system_state.rf.wlan.soft == 'unblocked' &&
                system_state.rf.wlan.hard == 'unblocked') {
                // console.log("Wi-Fi on");
                setTimeout(this.wifi_on, 1250);
            }
        },

        async blink_once(pin, mTime) {
            this.pin_on(pin);
            setTimeout(this.pin_off, mTime, pin);
        },

        async blink_twice(pin) {
            this.pin_on(pin);
            setTimeout(this.pin_off, 250, pin)
            setTimeout(this.pin_on, 500, pin);
            setTimeout(this.pin_off, 750, pin);
        },

        async pin_on(pin) {
            rpio.write(pin, rpio.HIGH);
        },

        async pin_off(pin) {
            rpio.write(pin, rpio.LOW);
        },

        async wifi_on() {
            this.pin_on(this.settings.green_pin);
            setTimeout(this.pin_on, 500, this.settings.yellow_pin);
            setTimeout(this.pin_on, 1000, this.settings.red_pin);
            setTimeout(this.pin_off, 1500, this.settings.green_pin);
            setTimeout(this.pin_off, 1500, this.settings.yellow_pin);
            setTimeout(this.pin_off, 1500, this.settings.red_pin);
        },

        async toggle_wifi(cbpin) {
            if (rpio.read(cbpin)) {
                console.log("Button released");
                //Get current state
                const system_state = await this.broker.call('system-state.state');
                console.log('Toggle State: %s', system_state);
                if (system_state.rf.wlan.soft == 'unblocked') {
                    //Disable WLAN
                    await exec("rfkill block wlan");
                } else {
                    //Enable WLAN
                    await exec("rfkill unblock wlan");
                }
            }
        }
    }


}