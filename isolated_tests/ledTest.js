/* 
 *  DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.
 *  
 *  This material is based upon work supported by the United States Air Force under
 *   Air Force Contract No. FA8702-15-D-0001. Any opinions, findings, conclusions 
 *   or recommendations expressed in this material are those of the author(s) and 
 *   do not necessarily reflect the views of the United States Air Force.
 *  
 *  (c) 2020 Massachusetts Institute of Technology.
 *  
 *  The software/firmware is provided to you on an As-Is basis
 *  
 *  Delivered to the U.S. Government with Unlimited Rights, as defined in 
 *  DFARS Part 252.227-7013 or 7014 (Feb 2014). Notwithstanding any copyright
 *  notice, U.S. Government rights in this work are defined by DFARS 252.227-7013 
 *  or DFARS 252.227-7014 as detailed above. Use of this work other than as 
 *  specifically authorized by the U.S. Government may violate any copyrights 
 *  that exist in this work.
 */

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



