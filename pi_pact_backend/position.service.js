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
const WebSocket = require('ws');



module.exports = {
    name: "position",

    settings: {
        url: 'ws://10.66.171.2:9090',
        ws: null,
        running: false, 
        dataDirectory: '/position',
        logger: null,
        messageCount: 0,
        lastMessage: null
    },

    dependencies: [
        "system-state"
    ],

    async started() {
        console.log("POSITION SERVICE STARTING");
        //Start recorder by default?
        const stateInfo = await this.broker.call('system-state.state');
        this.settings.systemId = stateInfo.system.serial;


        const transport = new (winston.transports.DailyRotateFile)({
            filename: `pipact-${this.settings.systemId}-%DATE%.json`,
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

//        this.settings.ws = new WebSocket(this.settings.url);

        this.settings.ws.on('open', ()=> {
            // console.log("opening position web socket");
            let op = "subscribe";
            let pose_subscribe_message = {"op": op, "topic": "/robot_pose"}
            this.settings.ws.send(JSON.stringify(pose_subscribe_message));
        })

        this.settings.ws.on('message', (msg) => {
            // console.log(msg);
            this.settings.logger.log({
                level: 'info',
                message: msg
            });
            this.settings.messageCount = this.settings.messageCount + 1;
            this.settings.lastMessage = msg;
        })
    },

    actions: {
        status: {
            async handler() {
                return {'running': this.settings.running, 'url': this.settings.url, 'dataDirectory': this.settings.dataDirectory, 'messageCount': this.settings.messageCount, 'lastMessage': this.settings.lastMessage}
            }
        },

        startPosition: {
            async handler() {

            }
        },

        stopPosition: {
            async handler() {
                
            }
        }
    }
}
