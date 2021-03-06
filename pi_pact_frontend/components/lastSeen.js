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
import React, { useState } from 'react'
import { Table, Alert } from 'react-bootstrap'


function LastSeen({ initData, clientSideUrl }) {
    const [sortConfig, setSortConfig] = useState({key: 'lastSeen', direction: 'descending'});
    const { data } = useSWR(clientSideUrl, fetcher,
        { refreshInterval: 5000, initialData: initData });

    if (!data) return <h1>Loading...</h1>

    const dataAsArray = [];
    Object.keys(data).map((key) => {
        dataAsArray.push(Object.assign({}, { mac: key }, data[key]));
    });

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    let sortedData = [...dataAsArray];
    if (sortConfig !== null) {
        if (sortConfig.key !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0;
            })
        }

    }

    // console.log("DAK: %s", JSON.stringify(dataAsArray));
    return (
        <>
            <h1>Last Seen</h1>
            <Table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('mac')}>MAC</th>
                        <th onClick={() => requestSort('count')}>Count</th>
                        <th onClick={() => requestSort('lastSeen')}>Last Seen</th>
                        <th onClick={() => requestSort('mean')}>Mean RSSI</th>
                        <th onClick={() => requestSort('min')}>Min RSSI</th>
                        <th onClick={() => requestSort('max')}>Max RSSI</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((values) => {
                        return (
                            <tr key={values.mac}>
                                <td>{values.mac}</td>
                                <td>{values.count}</td>
                                <td>{new Date(values.lastSeen).toLocaleString()}</td>
                                <td>{Math.round(values.mean)}</td>
                                <td>{values.min}</td>
                                <td>{values.max}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

export default LastSeen;