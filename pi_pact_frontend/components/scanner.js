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

import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import React, { useState } from 'react';
import Switch from 'react-switch';
import { Table } from 'react-bootstrap';

function Scanner({ initData, statusUrl, startUrl, stopUrl }) {
    const { data, mutate } = useSWR(statusUrl, fetcher,
        { refreshInterval: 1000, initialData: initData });

    if (!data) return <h1>Loading...</h1>

    const toggleScanner = (active) => {
        var url = null;
        if (active) {
            url = startUrl;
        } else {
            url = stopUrl;
        }
        console.log("URL: %s", url);
        fetch(url)
            .then(r => r.json())
            .then(d => {
                //console.log(d);
                mutate({ ...data, running: d.running });
            });
    }

    return (
        <>
            <h1>Scanner</h1>
            <Switch onChange={toggleScanner} checked={data.running} />
            <Table>
                <tbody>
                <tr>
                    <td>RX Count</td>
                    <td>{data.counter}</td>
                </tr>
                <tr>
                    <td>Last RX Time</td>
                    <td>{new Date(data.lastRxTime).toUTCString()}</td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}

export default Scanner;
