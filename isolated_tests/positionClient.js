const WebSocket = require('ws');


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let ws = new WebSocket('ws://127.0.0.1:9090');

ws.on('open', ()=>{
    console.log('New connection');
    let op = "subscribe";
    
    let pose_subscribe_message = {"op": op, "topic": "/robot_pose"};
    ws.send(JSON.stringify(pose_subscribe_message));
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