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
    },

    events: {
        "advertisment.received"(ctx) {
            if (this.settings.running) {
                console.log("RECORD Advertisment received!")
                this.settings.logger.log({
                    level: 'info',
                    message: ctx.params
                })
            } else {
                console.log("DROP Advertisment received!")
            }
        }
    },

    created() {
        //Start recorder by default?

        const transport = new (winston.transports.DailyRotateFile)({
            filename: 'pipact-ID-%DATE%.json',
            dirname: `${this.settings.dataDirectory}`,
            datePattern: 'YYYY-MM-DD-HH-mm',
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

    async started() {

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

                    rl.on('close',() => {
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

