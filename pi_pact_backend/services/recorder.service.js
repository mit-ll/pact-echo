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
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs')
const readline = require('readline');
module.exports = {
    name: "recorder",

    settings: {
        fileDuration: 1,
        running: false,
        dataDirectory: '/data',
        logger: null,
        systemId: null,
        rxMac: null
    },

    events: {
        "advertisment.received"(ctx) {
            if (this.settings.running) {
                console.log("RECORD Advertisment received!")
                this.settings.logger.log({
                    level: 'info',
                    message: ctx.params,
                    rxMac: this.settings.rxMac
                })
            }
        }
    },

    dependencies: [
        "system-state"
    ],

    async created() {

    },

    async started() {
        //Start recorder by default?
        const stateInfo = await this.broker.call('system-state.state');
        this.settings.systemId = stateInfo.system.serial;
        this.settings.rxMac = stateInfo.bt.hci0;

        const transport = new (winston.transports.DailyRotateFile)({
            filename: `pipact-${this.settings.systemId}-%DATE%.json`,
            dirname: `${this.settings.dataDirectory}`,
            datePattern: 'YYYY-MM-DD-HH-mm',
            utc: true,
            frequency: '1m',

        })

        this.settings.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                transport
            ]
        })
    },

    async stopped() {
        //Close the logger
    },

    actions: {
        status: {
            async handler() {
                return this.getStatus();
            }
        },

        startRecorder: {
            async handler() {
                this.settings.running = true;
                return this.getStatus();

            }
        },

        stopRecorder: {
            async handler() {
                this.settings.running = false;
                return this.getStatus();
            }
        },

        listFiles: {
            async handler() {
                const readdir = (dirname) => {
                    return new Promise((resolve, reject) => {
                        fs.readdir(dirname, (err, items) => {
                            if (err) reject(err);
                            // console.log(items);
                            resolve(items);
                        })
                    })
                };

                const getfilestats = (dirname, filename) => {
                    return new Promise((resolve, reject) => {
                        const f = `${dirname}/${filename}`;
                        // console.log('looking up %s', f);
                        fs.stat(f, (err, stats) => {
                            if (err) reject(err);
                            resolve({ 'filename': filename, 'fileinfo': stats });
                        })
                    })
                }

                return readdir(this.settings.dataDirectory)
                    .then((files) => {
                        var promises = [];
                        for (var i = 0; i < files.length; i++) {
                            // console.log("Pushing %s", files[i]);
                            promises.push(getfilestats(this.settings.dataDirectory, files[i]));
                        }
                        return Promise.all(promises);
                    })
                    .then((filesWithInfo) => {
                        // console.log("About to return");
                        return filesWithInfo;
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            }
        },

        getFile: {
            async handler(ctx) {
                console.log(`FILE: ${ctx.params.filename}`);
                var f = `${this.settings.dataDirectory}/${ctx.params.filename}`;
                console.log(`F: ${f}`);
                var fileContents = [];


                return new Promise((resolve, reject) => {
                    const rl = readline.createInterface({
                        input: fs.createReadStream(f),
                        output: process.stdout,
                        terminal: false
                    });

                    rl.on('line', (line) => {
                        fileContents.push(JSON.parse(line));
                    })

                    rl.on('close', () => {
                        resolve(fileContents);
                    })
                })
            }

        }
    },

    methods: {
        getStatus() {
            return {
                'running': this.settings.running,
                dataDirectory: this.settings.dataDirectory
            };
        },
    }
}

