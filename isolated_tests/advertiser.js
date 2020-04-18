var bleno = require('bleno');

var uuid = 'd2c56db5dffb48d2b060d0f5a71096e0';
var major = 05; // 0x0000 - 0xffff
var minor = 51; // 0x0000 - 0xffff
var measuredPower = -59; // -128 - 127


bleno.on('stateChange', (state) => {
    bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower, (error) => {
        console.log("Adversiting error: %s", error);
    });
    
}
);

bleno.on('advertisingStart', (error) => {
    console.log('AdvertisingStart: %s', error);
})