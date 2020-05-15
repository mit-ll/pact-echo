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

import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import getConfig from 'next/config'
import fetcher from '../lib/fetcher'
import absoluteUrl from 'next-absolute-url'
import LastSeen from '../components/lastSeen'

export default class extends Page {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <LastSeen initData={this.props.data} clientSideUrl={this.props.clientSideUrl}/>
                    {/* <Recorder initData={this.props.data} statusUrl={this.props.statusUrl} startUrl={this.props.startUrl} stopUrl={this.props.stopUrl} apiPrefix={this.props.apiPrefix} /> */}
                </Container>
            </Layout>
        )
    }
}

export const getServerSideProps = async context => {
    const { serverRuntimeConfig } = getConfig();
    const { host } = absoluteUrl(context.req);
    const serverSideUrl = `${serverRuntimeConfig.api_loc}/api/recorder/lastSeen`;
    const clientSideUrl = `http://${host}/api/recorder/lastSeen`;
    try {
        const data = await fetcher(serverSideUrl);
        return { props: { data, clientSideUrl } };
    } catch (error) {
        return { props: { data: error } };
    }
}