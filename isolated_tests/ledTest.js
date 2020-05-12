const gpio = require('rpi-gpio');

const pin = 20;
gpio.setMode(gpio.MODE_BCM);
let pin_state = false;

const write_pin = (err) => {
    if(err) {
        console.error(err);
        return;
    }
    pin_state = !pin_state;
    gpio.write(pin, pin_state, (err) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log('written to pin');
    })
    setTimeout(write_pin, 1000);
}


gpio.setup(pin, gpio.DIR_LOW, write_pin); //Output pin initially off



