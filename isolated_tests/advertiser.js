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