import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import { Badge } from 'react-bootstrap';
import Link from 'next/link';

function StatusCounter({counter}) {
    if (counter) {
        return ( <>({counter})</>);
    } else {
        return <></>
    }
}

function StatusBadge({ isOn, counter }) {
    if (isOn) {
        return <Badge variant='success'>On <StatusCounter counter={counter}/></Badge>
    } else {
        return <Badge variant="danger">Off</Badge>
    }
}

function OthersRowImpl({ connected, address, bt, scanner, scannerCount, recorder, recorderCount, beacon, position, positionCount }) {
    let connectedBadge;
    if (connected === 'connected') {
        connectedBadge = <Badge variant="primary">Connected</Badge>
    } else if (connected === 'loading') {
        connectedBadge = <Badge variant="secondary">Loading</Badge>
    } else {
        connectedBadge = <Badge variant="danger">Error</Badge>
    }

    let addressEntry;
    if (connected === 'connected') {
        addressEntry = <>
            <Link href={`http://${address}:3030/`}>
                <a target='_blank' rel='noopener noreferrer'>{address}</a>
            </Link>
        </>
    } else {
        addressEntry = <span>{address}</span>;
    }

    return (
        <tr key={address}>
            <td>{connectedBadge}</td>
            <td>{addressEntry}</td>
            <td>{bt}</td>
            <td><StatusBadge isOn={scanner} counter={scannerCount} /></td>
            <td><StatusBadge isOn={recorder} counter={recorderCount} /></td>
            <td><StatusBadge isOn={beacon} /></td>
            <td><StatusBadge isOn={position} /></td>
        </tr>
    )

}

function OthersRow({ id, ip, refreshTime }) {
    const { data } = useSWR(`http://localhost:3000/api/others/status/${ip}`, fetcher,
        { refreshInterval: refreshTime * 1000, revalidateOnFocus: true });

    if (!data) return (
        <OthersRowImpl connected={'loading'} address={ip} />
    );

    if (data.data) {
        if (data.data.error) { //This is when back end is down, but front end is up?
            return (
                <OthersRowImpl connected={'error'} address={ip} />
            )
        }
    } else {
        return <OthersRowImpl connected={'error'} address={ip} />
    }

    return (
        <OthersRowImpl connected={'connected'}
            address={ip}
            bt={data.data.bt.hci0}
            scanner={data.scanner.running}
            scannerCount={data.scanner.counter}
            recorder={data.recorder.running}
            recorderCount={data.recorder.counter}
            beacon={data.beacon.running}
            position={data.position.running}
            positionCount={data.position.counter}
            key={ip} />
    )
}

export default OthersRow;