# Links and Libraries
## Node Libraries
* [node-blecon](https://github.com/sandeepmistry/node-bleacon)
    * Note: It's unclear what this add over noble and bleno
    * Issue: [Cannot find module 'bluetooth-hci-socket'](https://github.com/noble/bleno/issues/440) - Downgrade Node
* Noble
    * Issue: [Doesn't compile on RPi 3B+](https://github.com/noble/node-bluetooth-hci-socket/issues/107)
        * `npm install bluetooth-hci-socket@npm:@abandonware/bluetooth-hci-socket`
## Node
* [How to Updgrade or Downgrade Nodejs Using npm](https://www.surrealcms.com/blog/how-to-upgrade-or-downgrade-nodejs-using-npm.html)n
## System Prerequisits
* `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`
