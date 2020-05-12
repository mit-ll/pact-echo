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
