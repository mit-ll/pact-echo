const rpio = require('rpio')

const pin = 21;
rpio.init({mapping: 'gpio'});
rpio.open(pin, rpio.OUTPUT, rpio.LOW);

for (var i=0;i<5;i++) {
    rpio.write(pin, rpio.HIGH);
    rpio.sleep(1);

    rpio.write(pin, rpio.LOW);
    rpio.msleep(500);
}