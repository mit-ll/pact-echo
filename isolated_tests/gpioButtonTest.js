const rpio = require('rpio');

const pin = 16;
rpio.init({mapping: 'gpio'});

rpio.open(pin, rpio.INPUT, rpio.PULL_UP);

function pollcb(cbpin) {
    const state = rpio.read(cbpin)?'released':'pressed';
    console.log('Button event on P%d (button currently %s)', cbpin, state);

}

rpio.poll(pin, pollcb);