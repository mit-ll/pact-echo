import React from 'react'  
import Page from '../components/page' 
import {Container} from 'react-bootstrap' 
import Layout from '../components/layout'

export default class extends Page {
    render() { 
        return ( 
            <Layout {...this.props} navmenu={false} container={false}>
                <Container>
                    <h1>PiPACT</h1>
                    <p>Sensor and actuator for PACT testing</p>
                </Container>
            </Layout>
        )
    }
}