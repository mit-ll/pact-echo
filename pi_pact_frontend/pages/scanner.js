import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Scanner from '../components/scanner'
import getConfig from 'next/config'
import fetcher from '../lib/fetcher'

export default class extends Page {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Layout {...this.props} >
                <Container>
                    <Scanner initData={this.props.data} statusUrl={this.props.statusUrl} stopUrl={this.props.stopUrl} startUrl={this.props.startUrl} />
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig, publiRuntimeConfig } = getConfig();
    const statusUrl = `${serverRuntimeConfig.api_loc}/api/scannerStatus`;
    const startUrl = `${serverRuntimeConfig.api_loc}/api/scanner/start`;
    const stopUrl = `${serverRuntimeConfig.api_loc}/api/scanner/stop`;
    const data = await fetcher(statusUrl);
    const d = { props: { data, statusUrl, startUrl, stopUrl} };
    // console.log("PRE: %s", JSON.stringify(d));
    return d;
}