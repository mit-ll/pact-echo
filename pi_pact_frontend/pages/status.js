import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Status from '../components/status'
import getConfig from 'next/config'
import fetcher from '../lib/fetcher'
import absoluteUrl from 'next-absolute-url';

export default class extends Page {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Layout {...this.props} >
                <Container>
                    <Status d1={this.props.data} url={this.props.url} />
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig } = getConfig();
    // console.log("Absolute: %s", JSON.stringify(absoluteUrl(context.req)))
    const {host} = absoluteUrl(context.req);
    const systemStatusUrl = `${serverRuntimeConfig.api_loc}/api/status`;
    const url = `http://${host}/api/status`;
    // console.log("SSU %s", systemStatusUrl);
    try {
        const data = await fetcher(systemStatusUrl);
        return { props: { data, url } };
    } catch(error) {
        // console.error("Foo: %s", error);
        return {props: {data: error}};
    }
}