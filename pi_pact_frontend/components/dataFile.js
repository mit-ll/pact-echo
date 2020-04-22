import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import {Table} from 'react-bootstrap'

function DataFile(props) {
    console.log(props.filename);
    const filename = props.filename;
    const url = `http://192.168.1.83:3000/api/recorder/file/${filename}`;
    console.log(`ZZZ ${url}`)
    const {data, error} = useSWR(url, fetcher);

    if(error) console.error(error);

    if(!data) return <h1>dataFile Loading...</h1>

    return (
        <Table>
            <thead>
                <tr>
                    <td>Timestamp</td>
                    <td>TX Address</td>
                    <td>RSSI</td>
                    {/* <td>Else</td> */}
                </tr>
            </thead>
            <tbody>
                {
                    data.map((values, index) => {
                        return (
                            <tr key={values.uuid}>
                                <td>{values.timestamp}</td>
                                <td>{values.message.address}</td>
                                <td>{values.message.rssi}</td>
                                {/* <td>{JSON.stringify(values.message)}</td> */}
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
    )
}

export default DataFile;