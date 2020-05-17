const WebSocket = require('ws')

const connections = [];

const sendMessage = () => {
    console.log("Client Count: %s", connections.length);
    connections.map((clientWs, index) => {
        const payload = {
            topic: "/robot_pose",
            msg: {
                position: { y: -0.6550569504489463, x: -1.2605394207263068, z: 0.0 },
                orientation: { y: 0.0, x: 0.0, z: -0.4922552616170491, w: new Date().toLocaleString() }
            }, op: "publish"
        };

        console.log("Sending to client");
        clientWs.send(JSON.stringify(payload));
    })
}

setInterval(sendMessage, 1000);

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function connection(ws, req) {
    console.log("Connection request: %s", req.headers['sec-websocket-key']);
    ws.on('message', function incominig(message) {
        console.log('server rx: %s', message);
        connections.push(ws);
    });

    const payload = { data: 'connected' };
    ws.send(JSON.stringify(payload));
})
