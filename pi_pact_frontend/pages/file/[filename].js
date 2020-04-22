import {useRouter} from 'next/router'
import Layout from '../../components/layout'
import DataFile from '../../components/dataFile'
import {Container} from 'react-bootstrap'

const FileView = (props) => {
    const router = useRouter();
    const {filename} = router.query;
 
    if (filename===undefined) return (<h1>Filename Loading...</h1>)

    return (
        <Layout {...props} >
            <Container>
                <DataFile filename={filename}/>
            </Container>
        </Layout>
    )

}

export default FileView;