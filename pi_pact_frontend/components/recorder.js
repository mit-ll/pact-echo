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