import useSWR from "swr";
import fetcher from "../lib/fetcher";
import Switch from 'react-switch'
import { Table } from 'react-bootstrap'

function Beacon({initData, statusUrl, startUrl, stopUrl}) {
    const { data, mutate } = useSWR(statusUrl, fetcher,
        { refreshInterval: 1000, initialData: initData });

    if (!data) return <h1>Loading...</h1>

    const toggleBeacon = (active) => {
        let url = active ? startUrl : stopUrl;
        fetch(url)
            .then(r => r.json())
            .then(d => {
                mutate({ ...data, running: d.running });
            });
    }

    return (
        <>
            <h1>Beacon</h1>
            <Switch onChange={toggleBeacon} checked={data.running} />
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