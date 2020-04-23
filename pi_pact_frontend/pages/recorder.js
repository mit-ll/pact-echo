import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Recorder from '../components/recorder'
import getConfig from 'next/config'
import fetcher from '../lib/fetcher'

export default class extends Page {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <Recorder initData={this.props.data} statusUrl={this.props.statusUrl} startUrl={this.props.startUrl} stopUrl={this.props.stopUrl} apiPrefix={this.props.apiPrefix} />
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig, publiRuntimeConfig } = getConfig();
    const statusUrl = `${serverRuntimeConfig.api_loc}/api/recorderStatus`;
    const stopUrl = `${serverRuntimeConfig.api_loc}/api/recorder/stop`;
    const startUrl = `${serverRuntimeConfig.api_loc}/api/recorder/start`;
    const apiPrefix = `${serverRuntimeConfig.api_loc}/api`;
    const data = await fetcher(statusUrl);
    const d = { props: { data, statusUrl, startUrl, stopUrl, apiPrefix } };
    return d;
}