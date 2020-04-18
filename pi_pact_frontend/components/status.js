import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import { Table } from 'react-bootstrap'

function Status() {
    const { data, err } = useSWR('http://192.168.1.83:3000/api/status', fetcher,
        { refreshInterval: 5000 });
    if (err) return <div>Error {err}</div>
    if (!data) return <div>No data {data} end</div>
    const d = data;
    let uptime = data.time.uptime;
    let curtime = new Date(data.time.current);
    return (
        <>
            <h1>System Info</h1>
            <Table>
                <tbody>
                    <tr>
                        <td>Model</td>
                        <td>{data.system.model}</td>
                    </tr>
                    <tr>
                        <td>Serial Number</td>
                        <td>{data.system.serial}</td>
                    </tr>
                    <tr>
                        <td>Current Time</td>
                        <td>{curtime.toUTCString()}</td>
                    </tr>
                    <tr>
                        <td>Uptime</td>
                        <td>{get_uptime_string(uptime)}</td>
                    </tr>
                    <tr>
                        <td>Memory (bytes) (free/total)</td>
                        <td>{data.mem.free} / {data.mem.total}</td>
                    </tr>
                </tbody>
            </Table>
            <h1>Operating System</h1>
            <Table>
                <tbody>
                    <tr>
                        <td>Distro</td>
                        <td>{data.os.distro}</td>
                    </tr>
                    <tr>
                        <td>Kernel</td>
                        <td>{data.os.kernel}</td>
                    </tr>
                    <tr>
                        <td>Codename</td>
                        <td>{data.os.codename}</td>
                    </tr>
                </tbody>
            </Table>
            <h1>Storage</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Storage Device</th>
                        <th>Size (bytes)</th>
                        <th>Used (bytes)</th>
                        <th>Used (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.storage.map((values, index) => {
                        return (
                            <tr key={index}>
                                <td>{values.fs}</td>
                                <td>{values.size}</td>
                                <td>{values.used}</td>
                                <td>{values.use}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

/**
 * 
 * @param {*} uptime 
 */
function get_uptime_string(uptime) {
    // Inspiration: https://gist.github.com/HFreni/382e5b664cca0b9075974e879e874e57
    const days = Math.floor(uptime / (60 * 60 * 24));
    var r = uptime - days * 60 * 60 * 24;
    const hours = Math.floor(r / (60 * 60));
    r = r - hours * 60 * 60;
    const minutes = Math.floor(r / 60);
    const seconds = r - minutes * 60;
    // Initialize an array for the uptime. 
    let segments = [];

    // Format the uptime string. 	
    if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
    if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
    if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
    if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
    return segments.join(', ');
}

export default Status;