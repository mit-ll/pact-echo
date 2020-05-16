import useSWR from 'swr';
import fetcher from '../lib/fetcher'
import { Badge } from 'react-bootstrap';
import Link from 'next/link';

function StatusBadge({ isOn }) {
    if (isOn) {
        return <Badge variant='success'>On</Badge>
    } else {
        return <Badge variant="danger">Off</Badge>
    }
}

function OthersRowImpl({ connected, address, bt, scanner, recorder, beacon, position }) {
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
            <td><StatusBadge isOn={scanner} /></td>
            <td><StatusBadge isOn={recorder} /></td>
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
    if (data.error) {
        return (
            <OthersRowImpl connected={'error'} address={ip} />
        )
    }
    return (
        <OthersRowImpl connected={'connected'}
            address={ip}
            bt={data.data.bt.hci0}
            scanner={data.scanner.running}
            recorder={data.recorder.running}
            beacon={data.beacon.running}
            position={data.position.running} 
            key={ip}/>
    )
}

export default OthersRow;