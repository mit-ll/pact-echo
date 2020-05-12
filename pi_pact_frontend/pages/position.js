import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import getConfig from 'next/config'
import fetcher from '../lib/fetcher'
import Position from '../components/position'
import absoluteUrl from 'next-absolute-url'

export default class extends Page {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <Position initData={this.props.data} url={this.props.url} statusUrl={this.props.statusUrl} startUrl={this.props.startUrl} stopUrl={this.props.stopUrl} />
                    <p>This service connects via web-socket to ROS topic running on Waypoint robot and logs position data to file</p>
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig } = getConfig();
    const { host } = absoluteUrl(context.req);
    const positionStatusUrl = `${serverRuntimeConfig.api_loc}/api/position/status`;
    const statusUrl = `http://${host}/api/position/status`;
    const startUrl = `http://${host}/api/position/start`;
    const stopUrl = `http://${host}/api/position/stop`;
    console.log("server side: %s", positionStatusUrl);
    console.log("client side: %s", statusUrl);
    try {
        const data = await (fetcher(positionStatusUrl));
        return { props: { data, statusUrl, startUrl, stopUrl } };
    } catch (error) {
        return { props: { data: error } };
    }

}