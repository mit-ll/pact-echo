import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Status from '../components/status'

export default class extends Page {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Layout {...this.props} >
                <Container>
                    <Status/>
                </Container>
            </Layout>
        )
    }
}