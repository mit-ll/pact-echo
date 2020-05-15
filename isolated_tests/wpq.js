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


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let ws = new WebSocket('ws://10.66.171.2:9090');

ws.on('open', ()=>{
    console.log('New connection');
    let op = "subscribe";

    let points = [
"Phone 1", "Phone 2", "P1", "P2"];
    let i=3;
    console.log(`Request ${points[i]}`);
    let msg = {"op": "call_service", "service": "/waypoint_db/retrieve_waypoint", "args": { "waypointName": points[i]}};
    ws.send(JSON.stringify(msg));    
})

ws.on('message', (msg)=> {
    console.log(msg);
})

ws.on('close', () => {
    console.log('closing connection');
    ws.close();
});


console.log("Wait for 10-seconds");
sleep(10000).then(()=> {

});
