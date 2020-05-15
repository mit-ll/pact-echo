// api/recorder/lastSeen
import api_proxy from '../../../lib/api_proxy'

export default async (req, res) => {
    await api_proxy(req, res, 'recorder/lastSeen');
}
