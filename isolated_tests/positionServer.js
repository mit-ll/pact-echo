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