import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Beacon from '../components/beacon'

export default class extends Page {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <Beacon/>
                </Container>
            </Layout>
        )
    }
}