import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import { Table } from 'react-bootstrap'

function Position({initData, url}) {
    const {data, err} = useSWR(url, fetcher,
        {refreshInterval: 1000, initialData: initData});

    if(err) return <div>Error {err}</div>
    if(!data) return <div>No data</div>

    return (
        <>
        <h1>Position</h1>
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