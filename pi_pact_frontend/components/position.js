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

