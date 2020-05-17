import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import React, { useState } from 'react'
import { Table, Alert, Row, Col, Form } from 'react-bootstrap'
import OthersRow from '../components/othersRow'

function RefreshSelector({ refreshTime, setRefreshTime }) {
    const change = (event) => {
        setRefreshTime(event.target.value);
    }

    return (
        <Form.Group>
            <Form.Label>
                Refresh Interval
            </Form.Label>
            <Form.Control as="select" value={refreshTime} custom onChange={change}>
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="60">60</option>
            </Form.Control>
        </Form.Group>
    )
}

function Others({ nodes }) {
    const [refreshTime, setRefreshTime] = useState("30");

    return (
        <>
            <Row>
                <Col>
                    <h1>Others</h1>
                </Col>
                <Col xs={2}><RefreshSelector setRefreshTime={setRefreshTime} refreshTime={refreshTime} /></Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Address</th>
                                <th>BT</th>
                                <th>Scanner</th>
                                <th>Recorder</th>
                                <th>Beacon</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.map((values, index) => {
                                // console.log('V: %s', JSON.stringify(values));
                                // console.log('V: %s', values.ip);
                                return <OthersRow key={values.ip} id={values.id} ip={values.ip} refreshTime={refreshTime} />
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default Others;