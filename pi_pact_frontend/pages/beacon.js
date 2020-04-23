import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Beacon from '../components/beacon'
import fetcher from '../lib/fetcher'
import getConfig from 'next/config'

export default class extends Page {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <Beacon initData={this.props.data} statusUrl={this.props.statusUrl} startUrl={this.props.startUrl} stopUrl={this.props.stopUrl} />
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig, publiRuntimeConfig } = getConfig();
    const statusUrl = `${serverRuntimeConfig.api_loc}/api/beacon/status`;
    const startUrl = `${serverRuntimeConfig.api_loc}/api/beacon/start`;
    const stopUrl = `${serverRuntimeConfig.api_loc}/api/beacon/stop`;
    const data = await fetcher(statusUrl);
    const d = { props: { data, statusUrl, startUrl, stopUrl} };
    return d;
}