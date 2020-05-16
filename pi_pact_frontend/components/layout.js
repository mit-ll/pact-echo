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
                    <Nav.Item>
                        <Link href="/recorder" passHref>
                            <Nav.Link>Recorder</Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href="/beacon" passHref>
                            <Nav.Link>Beacon</Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href="/position" passHref>
                            <Nav.Link>Position</Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href="/lastSeen" passHref>
                            <Nav.Link>Last Seen</Nav.Link>
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link href="/others" passHref>
                            <Nav.Link>Others</Nav.Link>
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