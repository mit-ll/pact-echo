const gpio = require('rpi-gpio');

gpio.setMode(gpio.MODE_BCM);
let pin_state = false;

const write_pin_12 = (err) => {
    if(err) {
        console.error(err);
        return;
    }
    pin_state = !pin_state;
    gpio.write(12, pin_state, (err) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log('written to pin');
    })
    setTimeout(write_pin_12, 1000);
}


gpio.setup(12, gpio.DIR_LOW, write_pin_12); //Output pin initially off



