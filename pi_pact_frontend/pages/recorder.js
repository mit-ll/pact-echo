import Page from '../components/page'
import { Container } from 'react-bootstrap'
import Layout from '../components/layout'
import Recorder from '../components/recorder'

export default class extends Page {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout {...this.props}>
                <Container>
                    <Recorder/>
                </Container>
            </Layout>
        )
    }
}