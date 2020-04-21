import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Navbar, Nav } from 'react-bootstrap'
export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>PiPACT</title>
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
                        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
                        crossOrigin="anonymous"
                    />
                </Head>
                <Navbar>
                    <Navbar.Brand href="/">PiPACT</Navbar.Brand>
                    <Nav.Item>
                        <Link href="/status" passHref>
                            <Nav.Link>Status</Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href="/scanner" passHref>
                            <Nav.Link>Scanner</Nav.Link>
                        </Link>
                    </Nav.Item>
                </Navbar>
                <React.Fragment>
                    {this.props.children}
                </React.Fragment>
            </React.Fragment>
        )
    }
}