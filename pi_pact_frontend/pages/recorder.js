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