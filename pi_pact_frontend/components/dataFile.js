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

import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import { Table } from 'react-bootstrap'

function DataFile({ filename, filePrefix }) {
    const url = `${filePrefix}/${filename}`;
    const { data, error } = useSWR(url, fetcher);

    if (error) console.error(error);

    if (!data) return <h1>dataFile Loading...</h1>

    return (
        <Table>
            <thead>
                <tr>
                    <td>Timestamp</td>
                    <td>TX Address</td>
                    <td>RSSI</td>
                    {/* <td>Else</td> */}
                </tr>
            </thead>
            <tbody>
                {
                    data.map((values, index) => {
                        return (
                            <tr key={values.uuid}>
                                <td>{values.timestamp}</td>
                                <td>{values.message.address}</td>
                                <td>{values.message.rssi}</td>
                                {/* <td>{JSON.stringify(values.message)}</td> */}
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default DataFile;