import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import { Table } from 'react-bootstrap'

function DataFile({ filename, filePrefix }) {
    const url = `${filePrefix}/${filename}`;
    const { data, error } = useSWR(url, fetcher);

    if (error) console.error(error);

    if (!data) return <h1>dataFile Loading...</h1>

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