import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import React, { useState } from 'react'
import Switch from 'react-switch'
import { Table } from 'react-bootstrap'
import RecorderFileList from './recorderFileList';

function Recorder() {
    const { data, mutate } = useSWR('http://192.168.1.83:3000/api/recorderStatus', fetcher,
        { refreshInterval: 1000 });


    if (!data) return <h1>Loading...</h1>

    // console.log(data);
    // console.log(filelist);

    const toggleRecorder = (active) => {
        let url = `http://192.168.1.83:3000/api/recorder/${active ? 'start' : 'stop'}`;
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
            <RecorderFileList />
        </>
    )
}

export default Recorder;