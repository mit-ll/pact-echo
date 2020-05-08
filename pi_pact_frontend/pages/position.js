import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import getConfig from 'next/config'
import fetcher from '../lib/fetcher'
import Position from '../components/position'

export default class extends Page {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <Position initData={this.props.data} url={this.props.url}/>
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig, publiRuntimeConfig } = getConfig();
    const systemStatusUrl = `${serverRuntimeConfig.api_loc}/api/position/status`;
    const data = await fetcher(systemStatusUrl);
    const d = { props: { data: data, url: systemStatusUrl } };
    return d;
}