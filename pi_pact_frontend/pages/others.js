import Page from '../components/page'
import Layout from '../components/layout'
import Others from '../components/others'
import { Container } from 'react-bootstrap'

export default class extends Page {
    constructor(props) {
        super(props);
    }

    render() {
        let nodes = [
            { id: 1, ip: 'pipact-1' },
            { id: 2, ip: 'pipact-2' },
            { id: 3, ip: 'pipact-3' }

        ]
        for(var i=10;i<30;i++) {
            nodes.push({id: i, ip: `pipact-${i}`})
        }

        return (
            <Layout {...this.props}>
                <Container>
                    <Others nodes={nodes} />
                </Container>
            </Layout>
        )
    }
}