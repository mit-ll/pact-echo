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

import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { Table } from 'react-bootstrap'
import { useState } from 'react'
import SwitchWithError from '../components/switchWithError'

function Beacon({ initData, statusUrl, startUrl, stopUrl }) {
    const [curError, setCurError] = useState(null);
    const { data, mutate } = useSWR(statusUrl, fetcher,
        { refreshInterval: 1000, initialData: initData });

    if (!data) return <h1>Loading...</h1>

    const toggleBeacon = (active) => {
        let url = active ? startUrl : stopUrl;
        fetch(url)
            .then(r => r.json())
            .then(d => {
                mutate({ ...data, running: d.running });
            }).catch((error) => {
                setCurError(error);
                console.error(error);
            });
    }

    return (
        <>
            <h1>Beacon</h1>
            <SwitchWithError onChange={toggleBeacon} checked={data.running} curError={curError} setCurError={setCurError} what="beacon" />
            <h1>Info</h1>
            <Table>
                <tbody>
                    <tr>
                        <td>UUID</td>
                        <td>{data.uuid}</td>
                    </tr>
                    <tr>
                        <td>Major</td>
                        <td>{data.major}</td>
                    </tr>
                    <tr>
                        <td>Minor</td>
                        <td>{data.minor}</td>
                    </tr>
                    <tr>
                        <td>Power</td>
                        <td>{data.measuredPower}</td>
                    </tr>
                    <tr>
                        <td>Bleno State</td>
                        <td>{data.blenoState}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}

export default Beacon;