import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import React, { useState } from 'react';
import Switch from 'react-switch';

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
        </>
    )
}

export default Scanner;
