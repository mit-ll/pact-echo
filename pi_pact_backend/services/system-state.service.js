"use strict";
const si = require('systeminformation');


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
                    'mem': await si.mem()};
            }
        }
    }
}