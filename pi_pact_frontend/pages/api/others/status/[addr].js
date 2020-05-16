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

import fetcher from '../../../../lib/fetcher'

export default async (req, res) => {
    const url = `http://${req.query.addr}:3030/api/status`;
    const scannerUrl = `http://${req.query.addr}:3030/api/scanner/status`;
    const recorderUrl = `http://${req.query.addr}:3030/api/recorder/status`;
    const beaconUrl = `http://${req.query.addr}:3030/api/beacon/status`;
    const positionUrl = `http://${req.query.addr}:3030/api/position/status`;
    try {
        const data = await fetcher(url);
        const scanner = await fetcher(scannerUrl);
        const recorder = await fetcher(recorderUrl);
        const beacon = await fetcher(beaconUrl);
        const position = await fetcher(positionUrl);
        res.status(200).json({data, scanner, recorder, beacon, position});
    } catch(error) {
        res.status(500).json({error})
    }
    
}