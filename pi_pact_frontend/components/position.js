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
import { Table } from 'react-bootstrap'
import SwitchWithError from '../components/switchWithError'
import React, { useState } from 'react';

function Position({ initData, url, statusUrl, startUrl, stopUrl }) {
    const [curError, setCurError] = useState(null);
    const { data, err } = useSWR(url, fetcher,
        { refreshInterval: 1000, initialData: initData });

    if (err) return <div>Error {err}</div>
    if (!data) return <div>No data</div>

    const togglePosition = (active) => {
        var url = null;
        if (active) {
            url = startUrl;
        } else {
            url = stopUrl;
        }
        fetch(url)
            .then(r => r.json())
            .then(d => {
                mutate({ ...data, running: d.running });
            }).catch((error) => {
                console.error("E %s", error);
                setCurError(error);
            });
    }

    return (
        <>
            <h1>Position</h1>
            <SwitchWithError onChange={togglePosition} checked={data.running} curError={curError} setCurError={setCurError} what="position" />
            <Table>
                <tbody>
                    <tr>
                        <td>Message Count</td>
                        <td>{data.messageCount}</td>
                    </tr>
                    <tr>
                        <td>URL</td>
                        <td>{data.url}</td>
                    </tr>
                    <tr>
                        <td>Last Position</td>
                        <td>{data.lastMessage}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}

export default Position;

