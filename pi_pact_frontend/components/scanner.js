import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import React, {useState} from 'react';
import Switch from 'react-switch';
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart
} from "react-timeseries-charts";

function Scanner() {
    const { data, mutate } = useSWR('http://192.168.1.83:3000/api/scannerStatus', fetcher,
        { refreshInterval: 1000 });

        if(!data) return <h1>Loading...</h1>    

    const toggleScanner = (active) => {
        let url = `http://192.168.1.83:3000/api/scanner/${active ? 'start': 'stop'}`;
        //console.log("URL: %s", url);
        fetch(url)
        .then(r => r.json()) 
        .then(d => {
            //console.log(d);
            mutate({...data, running: d.running});
        });
    }

    return (
        <>
        <h1>Scanner</h1>
	    <Switch onChange={toggleScanner} checked={data.running}/>
        </>
    )
}

export default Scanner;
