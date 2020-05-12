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

const WebSocket = require('ws');

const ws = new WebSocket.Server({ port: 9090 });

const waitAndDo = (ws, times) => {
    if (times < 1) {
        ws.close();
        return;
    }

    setTimeout(function() {
        const payload = {
            msg: {
                position: {
                    y: Math.random(),
                    x: Math.random()
                }
            }
        };
        console.log(`publishing ${JSON.stringify(payload)}`);
        ws.send(JSON.stringify(payload));
        waitAndDo(ws, times-1);
    }, 1000);
}

ws.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    waitAndDo(ws, 10);
})