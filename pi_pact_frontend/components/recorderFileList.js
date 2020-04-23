import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import { Table } from 'react-bootstrap'
import Link from 'next/link'

function RecorderFileList({ apiPrefix }) {
    const { data } = useSWR(`${apiPrefix}/recorder/files`, fetcher,
        { refreshInterval: 30000 });
    if (!data) return <h1>Loading...</h1>

    return (
        <>
            <h1>Files</h1>
            <Table>
                <thead>
                    <tr>
                        <td>File</td>
                        <td>Size (bytes)</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map((values, index) => {
                        return (
                            <tr key={values.filename}>
                                <td>
                                    <Link href={`/file/${values.filename}`}>
                                        <a>
                                            {values.filename}
                                        </a>
                                    </Link>
                                </td>
                                <td>{values.fileinfo.size}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )

};

export default RecorderFileList;