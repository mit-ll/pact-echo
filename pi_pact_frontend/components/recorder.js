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
import Switch from 'react-switch'
import { Table } from 'react-bootstrap'
import RecorderFileList from './recorderFileList';

function Recorder({ initData, statusUrl, startUrl, stopUrl, apiPrefix }) {
    const { data, mutate } = useSWR(statusUrl, fetcher,
        { refreshInterval: 1000, initialData: initData });


    if (!data) return <h1>Loading...</h1>

    // console.log(data);
    // console.log(filelist);

    const toggleRecorder = (active) => {
        let url = active ? startUrl : stopUrl;
        fetch(url)
            .then(r => r.json())
            .then(d => {
                mutate({ ...data, running: d.running });
            });
    }

    return (
        <>
            <h1>Recorder</h1>
            <Switch onChange={toggleRecorder} checked={data.running} />
            <h1>Info</h1>
            <Table>
                <tbody>
                    <tr>
                        <td>Data Directory</td>
                        <td>{data.dataDirectory}</td>
                    </tr>
                </tbody>
            </Table>
            <RecorderFileList apiPrefix={apiPrefix} />
        </>
    )
}

export default Recorder;