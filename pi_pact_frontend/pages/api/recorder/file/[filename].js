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

import getConfig from 'next/config'
import fetcher from '../../../../lib/fetcher'

export default async (req, res) => {
    const {
        query: { filename },
    } = req;
    const { serverRuntimeConfig } = getConfig();
    const url = `${serverRuntimeConfig.api_loc}/api/recorder/file/${filename}`;
    try {
        const data = await fetcher(url);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error %s", error);
        res.status(500).json({ error });
    }
}