import {useRouter} from 'next/router'
import Layout from '../../components/layout'
import DataFile from '../../components/dataFile'
import {Container} from 'react-bootstrap'
import getConfig from 'next/config'

const FileView = (props) => {
    const router = useRouter();
    const {filename} = router.query;
 
    if (filename===undefined) return (<h1>Filename Loading...</h1>)

    return (
        <Layout {...props} >
            <Container>
                <DataFile filename={filename} filePrefix={props.filePrefix}/>
            </Container>
        </Layout>
    )

}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
    const filePrefix = `${serverRuntimeConfig.api_loc}/api/recorder/file`;
    const d = { props: { filePrefix } };
    return d;
}

export default FileView;