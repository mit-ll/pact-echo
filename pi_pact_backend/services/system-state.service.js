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
const si = require('systeminformation');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


module.exports = {
    name: "system-state",

    settings: {

    },

    actions: {
        state: {
            async handler() {
                return {
                    'status': 'online',
                    'time': await si.time(),
                    'system': await si.system(),
                    'os': await si.osInfo(),
                    'storage': await si.fsSize(),
                    'scanner': await this.broker.call('scanner.status'),
                    'mem': await si.mem(),
                    'rf': await this.check_rf_kill(),
                    'bt': await this.get_bt_mac()
                };
            }
        }
    },
    methods: {
        async check_rf_kill() {
            var data = {};
            const { stdout } = await exec("rfkill --json");
            const output = JSON.parse(stdout);
            const responses = output[''];
            for (var i = 0; i < responses.length; i++) {
                data[responses[i]['type']] = {
                    soft: responses[i].soft,
                    hard: responses[i].hard
                };
            }
            return data;
        },

        async get_bt_mac() {
            const { stdout } = await exec("hcitool dev");
            const lines = stdout.split('\n');
            const re = /hci0/;
            const mac = /[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/g;
            for (var i = 0; i < lines.length; i++) {
                if (re.test(lines[i])) {
                    const e = mac.exec(lines[i]);
                    return {'hci0': e[0]};
                }
            }
        }
    }
}