/* 
 *  DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.
 *  
 *  This material is based upon work supported by the United States Air Force under
 *   Air Force Contract No. FA8702-15-D-0001. Any opinions, findings, conclusions 
 *   or recommendations expressed in this material are those of the author(s) and 
 *   do not necessarily reflect the views of the United States Air Force.
 *  
 *  (c) 2020 Massachusetts Institute of Technology.
 *  
 *  The software/firmware is provided to you on an As-Is basis
 *  
 *  Delivered to the U.S. Government with Unlimited Rights, as defined in 
 *  DFARS Part 252.227-7013 or 7014 (Feb 2014). Notwithstanding any copyright
 *  notice, U.S. Government rights in this work are defined by DFARS 252.227-7013 
 *  or DFARS 252.227-7014 as detailed above. Use of this work other than as 
 *  specifically authorized by the U.S. Government may violate any copyrights 
 *  that exist in this work.
 */

import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import { Table } from 'react-bootstrap'
import Link from 'next/link'
import pretty from 'prettysize'

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
                        <td>Size</td>
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
                                <td>{pretty(values.fileinfo.size)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )

};

export default RecorderFileList;